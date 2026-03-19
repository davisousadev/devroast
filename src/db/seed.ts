import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { roastIssues, stats, submissions } from './schema';

const pool = new pg.Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://devroast:devroast123@localhost:5433/devroast',
});

const db = drizzle(pool);

const languages = [
	'javascript',
	'typescript',
	'python',
	'java',
	'go',
	'rust',
	'csharp',
	'ruby',
];
const issueTypes = ['critical', 'warning', 'good'] as const;

const issueTitles: Record<string, string[]> = {
	critical: [
		'Variável não utilizada',
		'Função sem retorno',
		'Loop infinito potencial',
		'Segurança: entrada sem sanitização',
		'Memory leak detectado',
		'Race condition possível',
	],
	warning: [
		'Nome de variável confuso',
		'Código duplicado',
		'Complexidade alta',
		'Missing error handling',
		'Console.log leftover',
		'Magic numbers detected',
	],
	good: [
		'Boa nomenclatura',
		'Código bem estruturado',
		'Docstring ausente mas recomendado',
		'Testes ausentes',
		'Tipagem poderia ser mais específica',
	],
};

const sampleCodes = [
	`function calculate(a, b) {
  return a + b;
}`,
	`const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};`,
	`class User {
  constructor(name) {
    this.name = name;
  }
}`,
	`export default function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}`,
	`const list = [1, 2, 3, 4, 5];
const result = list.map(x => x * 2);`,
	`if (user.isActive) {
  console.log("User is active");
}`,
	`try {
  const data = JSON.parse(input);
} catch (e) {
  console.log(e);
}`,
	`for (let i = 0; i < 10; i++) {
  console.log(i);
}`,
	`const config = {
  apiUrl: "http://localhost:3000",
  timeout: 5000
};`,
	`export const add = (a, b) => a + b;`,
];

function generateCode(): string {
	return faker.helpers.arrayElement(sampleCodes);
}

function generateUsername(): string {
	const prefixes = [
		'dev',
		'code',
		'script',
		'bug',
		'dev',
		'node',
		'code',
		'js',
		'py',
		'rust',
		'anon',
	];
	const suffixes = ['', '_', '1', '42', '99', '007', '_'];
	const numbers = faker.string.numeric(4);
	const prefix = faker.helpers.arrayElement(prefixes);
	const suffix = faker.helpers.arrayElement(suffixes);
	return `${prefix}${suffix}${numbers}`;
}

function generateIssue(type: (typeof issueTypes)[number]) {
	const titles = issueTitles[type];
	return {
		type,
		title: faker.helpers.arrayElement(titles),
		description: faker.lorem.sentence(),
		line: faker.number.int({ min: 1, max: 100 }),
	};
}

async function seed() {
	console.log('🌱 Starting seed...');

	const submissionIds: string[] = [];

	for (let i = 0; i < 100; i++) {
		const language = faker.helpers.arrayElement(languages);
		const score = faker.number.int({ min: 0, max: 100 });
		const roastMode = faker.datatype.boolean();

		const [submission] = await db
			.insert(submissions)
			.values({
				code: generateCode(),
				language,
				roastMode,
				score,
				username: generateUsername(),
			})
			.returning({ id: submissions.id });

		submissionIds.push(submission.id);

		const issueCount = faker.number.int({ min: 2, max: 6 });
		const issues = [];

		for (let j = 0; j < issueCount; j++) {
			const typeWeights: (typeof issueTypes)[number][] =
				score > 70
					? ['good', 'warning', 'critical']
					: ['critical', 'warning', 'good'];
			const type = faker.helpers.arrayElement(typeWeights);
			issues.push(generateIssue(type));
		}

		await db.insert(roastIssues).values(
			issues.map((issue) => ({
				submissionId: submission.id,
				...issue,
			}))
		);

		if ((i + 1) % 10 === 0) {
			console.log(`✅ Created ${i + 1} submissions`);
		}
	}

	const avgScore = faker.number.int({ min: 50, max: 85 });
	await db.insert(stats).values({
		totalCodesRoasted: 100,
		averageScore: avgScore,
	});

	console.log(`✅ Seed completed! Created 100 submissions with roast issues.`);
	console.log(`✅ Created stats record with average score: ${avgScore}`);

	await pool.end();
}

seed().catch((err) => {
	console.error('❌ Seed failed:', err);
	process.exit(1);
});
