#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { convertConfig } from './lib/configConverter.js';
import { migrateEnvVars } from './lib/envMigration.js';
import { generateChecklist } from './lib/checklist.js';
import fs from 'fs/promises';
import path from 'path';

program
  .name('vercel-to-netlify-migrator')
  .description('CLI tool to migrate projects from Vercel to Netlify')
  .version('1.0.0');

program
  .command('migrate')
  .description('Start interactive migration process')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .action(async (options) => {
    console.log(chalk.blue.bold('\n🚀 Vercel to Netlify Migration Tool\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'hasVercelJson',
        message: 'Do you have a vercel.json configuration file?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'migrateEnv',
        message: 'Do you want to migrate environment variables?',
        default: true,
      },
      {
        type: 'input',
        name: 'framework',
        message: 'What framework are you using? (e.g., Next.js, React, Vue)',
        default: 'Next.js',
      },
      {
        type: 'confirm',
        name: 'generateChecklist',
        message: 'Generate migration checklist?',
        default: true,
      },
    ]);

    const projectPath = options.path;

    try {
      // Convert vercel.json to netlify.toml
      if (answers.hasVercelJson) {
        console.log(chalk.yellow('\n📝 Converting configuration files...\n'));
        await convertConfig(projectPath);
        console.log(chalk.green('✓ Configuration converted successfully\n'));
      }

      // Migrate environment variables
      if (answers.migrateEnv) {
        console.log(chalk.yellow('🔐 Processing environment variables...\n'));
        await migrateEnvVars(projectPath);
        console.log(chalk.green('✓ Environment variables processed\n'));
      }

      // Generate checklist
      if (answers.generateChecklist) {
        console.log(chalk.yellow('📋 Generating migration checklist...\n'));
        await generateChecklist(projectPath, answers.framework);
        console.log(chalk.green('✓ Checklist generated: MIGRATION_CHECKLIST.md\n'));
      }

      console.log(chalk.green.bold('\n✨ Migration preparation complete!\n'));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.cyan('1. Review the generated netlify.toml file'));
      console.log(chalk.cyan('2. Check MIGRATION_CHECKLIST.md for manual steps'));
      console.log(chalk.cyan('3. Deploy to Netlify: netlify deploy\n'));

    } catch (error) {
      console.error(chalk.red('\n❌ Error during migration:'), error.message);
      process.exit(1);
    }
  });

program
  .command('convert-config')
  .description('Convert vercel.json to netlify.toml')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .action(async (options) => {
    try {
      await convertConfig(options.path);
      console.log(chalk.green('✓ Configuration converted successfully'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('env-migrate')
  .description('Migrate environment variables from .env files')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .action(async (options) => {
    try {
      await migrateEnvVars(options.path);
      console.log(chalk.green('✓ Environment variables processed'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('checklist')
  .description('Generate migration checklist')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .option('-f, --framework <framework>', 'Framework name', 'Next.js')
  .action(async (options) => {
    try {
      await generateChecklist(options.path, options.framework);
      console.log(chalk.green('✓ Checklist generated: MIGRATION_CHECKLIST.md'));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();
