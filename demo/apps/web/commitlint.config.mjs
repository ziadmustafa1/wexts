/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code refactoring
        'perf',     // Performance
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD
        'build',    // Build system
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
  },
}
