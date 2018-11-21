import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { LocalStorageInterface } from 'ember-iniesta/storage-adapters/local-storage';

module('Unit | StorageAdapter | local-storage', (hooks) => {
	const dbName = 'database';
	let storage: LocalStorageInterface;

	setupTest(hooks);

	hooks.beforeEach(function(this: TestContext) {
		const factory = this.owner.factoryFor('storage-adapter:local-storage');

		storage = factory.create({ key: dbName });
	});

	hooks.afterEach(function(this: TestContext) {
		window.localStorage.clear();
	});

	test('it exists', function(assert) {
		assert.ok(storage);
	});

	test('it pushes an item', async(assert) => {
		await storage.push({ foo: 'bar' });

		const count = await storage.count();

		assert.equal(count, 1, 'item exists');
	});

	test('it pushes several items', async(assert) => {
		await storage.push({ foo: 'bar' }, { bar: 'foo' });

		const count = await storage.count();

		assert.equal(count, 2, 'items exist');
	});

	test('it unshifts an item', async(assert) => {
		await storage.unshift({ foo: 'bar' });

		const count = await storage.count();

		assert.equal(count, 1, 'item exists');
	});

	test('it unshifts several items', async(assert) => {
		await storage.unshift({ foo: 'bar' }, { bar: 'foo' });

		const count = await storage.count();

		assert.equal(count, 2, 'items exist');
	});

	test('it pushes an item and pops once', async(assert) => {
		await storage.push({ foo: 'bar' });

		const item = await storage.pop();

		assert.deepEqual(item, [{ foo: 'bar' }], 'item is expected');
	});

	test('it pushes items and pops once', async(assert) => {
		await storage.push({ foo: 'bar' }, { bar: 'foo' });

		const item = await storage.pop();

		assert.deepEqual(item, [{ bar: 'foo' }], 'item is expected');
	});

	test('it pushes an item and shifts once', async(assert) => {
		await storage.push({ foo: 'bar' });

		const item = await storage.shift();

		assert.deepEqual(item, [{ foo: 'bar' }], 'item is expected');
	});

	test('it pushes items and shifts once', async(assert) => {
		await storage.push({ foo: 'bar' }, { bar: 'foo' });

		const item = await storage.shift();

		assert.deepEqual(item, [{ foo: 'bar' }], 'item is expected');
	});

	test('it pushes items and shifts several times', async(assert) => {
		await storage.push({ foo: 'bar' }, { bar: 'foo' });

		const item = await storage.shift(2);

		assert.deepEqual(item, [{ foo: 'bar' }, { bar: 'foo' }], 'item is expected');
	});
});

