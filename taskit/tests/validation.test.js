import { validateCategoryName, validateTaskText, validateCredentials } from '../lib/validation.js';

function assert(name, condition) {
  if (!condition) throw new Error(`Test failed: ${name}`);
  console.log(`✓ ${name}`);
}

// Category name tests
assert('Category name required', !validateCategoryName('').valid);
assert('Category name trim', validateCategoryName('  Work  ').value === 'Work');
assert('Category normalized lower', validateCategoryName('Work').normalized === 'work');

// Task text tests
assert('Task text required', !validateTaskText('').valid);
assert('Task text trim', validateTaskText('  Task  ').value === 'Task');

// Credentials tests
assert('Invalid email rejected', !validateCredentials({ email: 'bad', password: '123456', name: 'A' }).valid);
assert('Short password rejected', !validateCredentials({ email: 'a@b.com', password: '123', name: 'A' }).valid);
assert('Valid credentials accepted', validateCredentials({ email: 'a@b.com', password: '123456', name: 'A' }).valid);

console.log('All validation tests passed');

