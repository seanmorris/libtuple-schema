import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import Schema from '../Schema.mjs';

import Tuple from 'libtuple/Tuple.mjs';

const s = Schema;

const [major, minor, patch] = process.versions.node.split('.');

test('s.tuple test', t => {
	const pointSchema = s.tuple(
		s.number(),
		s.number(),
	);

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([5, 10]);
	const pointC = pointSchema([5, 10, 1]);
	const pointD = pointSchema([1, 5, 10]);

	assert.strictEqual(pointA, pointB);
	assert.notEqual(pointA, pointC);
	assert.notEqual(pointA, pointD);
	assert.throws(() => pointSchema([5, 'lol']));
});

test('s.group test', t => {
	const numbersSchema = s.group(
		s.number(),
		s.number(),
	);

	const pointA = numbersSchema([5, 10]);
	const pointB = numbersSchema([10, 5]);
	const pointC = numbersSchema([5, 10, 1]);
	const pointD = numbersSchema([1, 5, 10]);

	assert.strictEqual(pointA, pointB);
	assert.strictEqual(pointC, pointD);

	assert.notEqual(pointA, pointC);
	assert.notEqual(pointB, pointD);

	assert.throws(() => numbersSchema([5, 'lol']));
});

test('s.record test', t => {
	const numbersSchema = s.record({
		x: s.number(),
		y: s.number(),
	});

	const pointA = numbersSchema({x: 0, y: 1,});
	const pointB = numbersSchema({y: 1, x: 0,});
	const pointC = numbersSchema({x: 0, y: 1, z: 0,});
	const pointD = numbersSchema({z: 0, y: 1, x: 0,});

	assert.strictEqual(pointA, pointB);
	assert.strictEqual(pointC, pointD);

	assert.notEqual(pointA, pointC);
	assert.notEqual(pointB, pointD);

	assert.throws(() => numbersSchema({x: 0, y: 'lol',}));
});

test('s.dict test', t => {
	const numbersSchema = s.dict({
		x: s.number(),
		y: s.number(),
	});

	const pointA = numbersSchema({x: 0, y: 1,});
	const pointB = numbersSchema({y: 1, x: 0,});
	const pointC = numbersSchema({y: 1, x: 0,});

	const pointD = numbersSchema({x: 0, y: 1, z: 0,});
	const pointE = numbersSchema({z: 0, y: 1, x: 0,});
	const pointF = numbersSchema({z: 0, y: 1, x: 0,});

	assert.notEqual(pointA, pointB);
	assert.strictEqual(pointB, pointC);

	assert.notEqual(pointD, pointE);
	assert.strictEqual(pointE, pointF);

	assert.throws(() => numbersSchema({x: 0, y: 'lol',}));
});

test('s.sTuple test', t => {
	const pointSchema = s.sTuple(
		s.number(),
		s.number(),
	);

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([5, 10]);
	const pointC = pointSchema([10, 5]);

	assert.strictEqual(pointA, pointB);
	assert.notEqual(pointA, pointC);
	assert.throws(() => pointSchema([1, 2, 3]));
});

test('s.sGroup test', t => {
	const pointSchema = s.sGroup(
		s.number(),
		s.number(),
	);

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([5, 10]);
	const pointC = pointSchema([10, 5]);
	const pointD = pointSchema([10, 1]);

	assert.strictEqual(pointA, pointB);
	assert.strictEqual(pointA, pointC);
	assert.notEqual(pointA, pointD);
	assert.throws(() => pointSchema([1, 2, 3]));
});

test('s.sRecord test', t => {
	const numbersSchema = s.sRecord({
		x: s.number(),
		y: s.number(),
	});

	const pointA = numbersSchema({x: 0, y: 1,});
	const pointB = numbersSchema({y: 1, x: 0,});
	const pointC = numbersSchema({x: 1, y: 0,});

	assert.strictEqual(pointA, pointB);
	assert.notEqual(pointA, pointC);

	assert.throws(() => numbersSchema({x: 0, y: 0, z: 0}));
	assert.throws(() => numbersSchema({}));
});

test('s.sDict test', t => {
	const numbersSchema = s.sDict({
		x: s.number(),
		y: s.number(),
	});

	const pointA = numbersSchema({x: 0, y: 1,});
	const pointB = numbersSchema({y: 1, x: 0,});
	const pointC = numbersSchema({x: 1, y: 0,});
	const pointD = numbersSchema({x: 1, y: 0,});

	assert.notEqual(pointA, pointB);
	assert.notEqual(pointB, pointC);
	assert.strictEqual(pointC, pointD);
	assert.throws(() => numbersSchema({x: 0, y: 0, z: 0}));
	assert.throws(() => numbersSchema({}));
});

test('s.xTuple test', t => {
	const pointSchema = s.xTuple(
		s.number(),
		s.number(),
	);

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([5, 10, 1]);
	const pointC = pointSchema([10, 5]);

	assert.strictEqual(pointA, pointB);
	assert.notEqual(pointA, pointC);
	assert.throws(() => pointSchema());
});

test('s.xGroup test', t => {
	const pointSchema = s.xGroup(
		s.number(),
		s.number(),
	);

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([5, 10, 1]);
	const pointC = pointSchema([10, 5]);
	const pointD = pointSchema([10, 6]);

	assert.strictEqual(pointA, pointB);
	assert.strictEqual(pointA, pointC);
	assert.notEqual(pointA, pointD);
	assert.throws(() => pointSchema());
});

test('s.xRecord test', t => {
	const numbersSchema = s.xRecord({
		x: s.number(),
		y: s.number(),
	});

	const pointA = numbersSchema({x: 0, y: 1,});
	const pointB = numbersSchema({y: 1, x: 0, z: 0});
	const pointC = numbersSchema({x: 1, y: 0,});

	assert.strictEqual(pointA, pointB);
	assert.notEqual(pointA, pointC);
});

test('s.xDict test', t => {
	const numbersSchema = s.xDict({
		x: s.number(),
		y: s.number(),
	});

	const pointA = numbersSchema({x: 0, y: 1,});
	const pointB = numbersSchema({y: 1, x: 0,});
	const pointC = numbersSchema({x: 1, y: 0,});
	const pointD = numbersSchema({x: 1, y: 0, z: 0});

	assert.notEqual(pointA, pointB);
	assert.notEqual(pointB, pointC);
	assert.strictEqual(pointC, pointD);
});

test('s.nTuple test', t => {
	const pointSchema = s.nTuple(s.number());

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([5, 10]);
	const pointC = pointSchema([5, 10, 1]);
	const pointD = pointSchema([1, 5, 10]);
	const pointE = pointSchema([5]);
	const pointF = pointSchema(5);

	assert.strictEqual(pointA, pointB);
	assert.notEqual(pointA, pointC);
	assert.notEqual(pointA, pointD);
	assert.strictEqual(pointE, pointF);
	assert.throws(() => pointSchema([5, 'lol']));
});

test('s.nGroup test', t => {
	const pointSchema = s.nGroup(s.number());

	const pointA = pointSchema([5, 10]);
	const pointB = pointSchema([10, 5]);
	const pointC = pointSchema([5, 10, 1]);
	const pointD = pointSchema([1, 5, 10]);
	const pointE = pointSchema([5]);
	const pointF = pointSchema(5);

	assert.strictEqual(pointA, pointB);
	assert.strictEqual(pointC, pointD);
	assert.strictEqual(pointE, pointF);
	assert.notEqual(pointA, pointC);
	assert.notEqual(pointA, pointD);
	assert.throws(() => pointSchema([5, 'lol']));
});

test('s.nRecord test', t => {
	const pointsSchema = s.nRecord({x: s.number(),y: s.number(),});
	const triangleSchema = s.nRecord(
		{x: s.number(), y: s.number(),},
		{min: 3, max: 3}
	);

	const pointsA = pointsSchema([ {x: 0, y: 1,} ]);
	const pointsB = pointsSchema([ {y: 1, x: 0,} ]);
	const pointsC = pointsSchema([ {x: 0, y: 1, z: 0,} ]);
	const pointsD = pointsSchema([ {z: 0, y: 1, x: 0,} ]);

	assert.strictEqual(pointsA, pointsB);
	assert.strictEqual(pointsC, pointsD);

	assert.notEqual(pointsA, pointsC);
	assert.notEqual(pointsB, pointsD);

	assert.throws(() => pointsSchema({x: 0, y: 'lol',}));
	assert.ok(() => triangleSchema([{x: 0, y: 0,}, {x: 0, y: 0,}, {x: 0, y: 0,}]));
	assert.throws(() => triangleSchema([{x: 0, y: 0,}]));
	assert.throws(() => triangleSchema([{x: 0, y: 0,}, {x: 0, y: 0,}, {x: 0, y: 0,}, {x: 0, y: 0,}]));
});

test('s.nDict test', t => {
	const pointsSchema = s.nDict({x: s.number(), y: s.number(),});
	const triangleSchema = s.nDict(
		{x: s.number(), y: s.number(),},
		{min: 3, max: 3}
	);

	const pointsA = pointsSchema([ {x: 0, y: 1,} ]);
	const pointsB = pointsSchema([ {x: 0, y: 1} ]);
	const pointsC = pointsSchema([ {x: 0, y: 1, z: 0,} ]);
	const pointsD = pointsSchema([ {x: 0, y: 1, z: 0,} ]);

	assert.strictEqual(pointsA, pointsB);
	assert.strictEqual(pointsC, pointsD);

	assert.notEqual(pointsA, pointsC);
	assert.notEqual(pointsB, pointsD);

	assert.throws(() => pointsSchema({x: 0, y: 'lol',}));
	assert.ok(() => triangleSchema([{x: 0, y: 0,}, {x: 0, y: 0,}, {x: 0, y: 0,}]));
	assert.throws(() => triangleSchema([{x: 0, y: 0,}]));
	assert.throws(() => triangleSchema([{x: 0, y: 0,}, {x: 0, y: 0,}, {x: 0, y: 0,}, {x: 0, y: 0,}]));
});

test('s.boolean test', t => {
	const schema = s.boolean();

	assert.strictEqual(s.parse(schema, false), false);
	assert.strictEqual(s.parse(schema, true), true);
	assert.throws(() => schema('not a boolean'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.boolean({optional: true, default: true});

	assert.strictEqual(s.parse(schemaOptional, false), false);
	assert.strictEqual(s.parse(schemaOptional, true), true);
	assert.strictEqual(s.parse(schemaOptional, undefined), true);
	assert.throws(() => schemaOptional('not a boolean'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.boolean({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, false), false);
	assert.strictEqual(s.parse(schemaNullable, true), true);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a boolean'), 'SchemaMapper should throw errors on bad value.');

	const schemaMapped = s.boolean({map: Number});

	assert.strictEqual(s.parse(schemaMapped, false), 0);
	assert.strictEqual(s.parse(schemaMapped, true), 1);
});

test('s.number test', t => {
	const schema = s.number();
	assert.strictEqual(s.parse(schema, 0), 0);
	assert.strictEqual(s.parse(schema, 1), 1);

	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.number({optional: true, default: 1});

	assert.strictEqual(s.parse(schemaOptional, 0), 0);
	assert.strictEqual(s.parse(schemaOptional, 1), 1);
	assert.strictEqual(s.parse(schemaOptional, undefined), 1);
	assert.throws(() => schemaOptional('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.number({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 0), 0);
	assert.strictEqual(s.parse(schemaNullable, 1), 1);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaRanged = s.number({min: 0, max: 10});

	assert.strictEqual(s.parse(schemaRanged, 0), 0);
	assert.strictEqual(s.parse(schemaRanged, 1), 1);
	assert.strictEqual(s.parse(schemaRanged, 10), 10);
	assert.strictEqual(s.parse(schemaRanged, 11), NaN);
	assert.strictEqual(s.parse(schemaRanged, -1), NaN);

	const schemaMapped = s.number({map: String});

	assert.strictEqual(s.parse(schemaMapped, 0), '0');
	assert.strictEqual(s.parse(schemaMapped, 1), '1');
});

test('s.integer test', t => {
	const schema = s.integer();
	assert.strictEqual(s.parse(schema, 0), 0);
	assert.strictEqual(s.parse(schema, 1), 1);
	assert.strictEqual(s.parse(schema, 255), 255);

	assert.throws(() => schema(1.5), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.integer({optional: true, default: 1});

	assert.strictEqual(s.parse(schemaOptional, 0), 0);
	assert.strictEqual(s.parse(schemaOptional, 1), 1);
	assert.strictEqual(s.parse(schemaOptional, undefined), 1);
	assert.throws(() => schemaOptional('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.integer({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 0), 0);
	assert.strictEqual(s.parse(schemaNullable, 1), 1);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaEven = s.integer({check: x => x % 2 === 0});

	assert.strictEqual(s.parse(schemaEven, 0), 0);
	assert.strictEqual(s.parse(schemaEven, 1), NaN);
	assert.strictEqual(s.parse(schemaEven, 2), 2);
	assert.strictEqual(s.parse(schemaEven, 3), NaN);
});

test('s.float test', t => {
	const schema = s.float();
	assert.strictEqual(s.parse(schema, 0), 0);
	assert.strictEqual(s.parse(schema, 1.1), 1.1);
	assert.strictEqual(s.parse(schema, 255), 255);
	assert.strictEqual(s.parse(schema, 255.5), 255.5);

	assert.throws(() => schema(NaN), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.float({optional: true, default: 1});

	assert.strictEqual(s.parse(schemaOptional, 0), 0);
	assert.strictEqual(s.parse(schemaOptional, 1), 1);
	assert.strictEqual(s.parse(schemaOptional, undefined), 1);
	assert.throws(() => schemaOptional('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.float({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 0), 0);
	assert.strictEqual(s.parse(schemaNullable, 1), 1);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaEven = s.float({check: x => x % 2 === 0});

	assert.strictEqual(s.parse(schemaEven, 0), 0);
	assert.strictEqual(s.parse(schemaEven, 1), NaN);
	assert.strictEqual(s.parse(schemaEven, 2), 2);
	assert.strictEqual(s.parse(schemaEven, 3), NaN);
});

test('s.NaN test', t => {
	const schema = s.NaN();
	assert.strictEqual(s.parse(schema, NaN), NaN);
	assert.strictEqual(s.parse(schema, 0/0), NaN);

	assert.throws(() => schema(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a literal NaN'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.NaN({optional: true, default: 1});

	assert.strictEqual(s.parse(schemaOptional, NaN), NaN);
	assert.strictEqual(s.parse(schemaOptional, undefined), 1);
	assert.throws(() => schemaOptional('not a literal NaN'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.NaN({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, NaN), NaN);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a literal NaN'), 'SchemaMapper should throw errors on bad value.');

	
	let canPass;
	const schemaChecked = s.NaN({ check: () => canPass });

	canPass = true;
	assert.strictEqual(schemaChecked(NaN), NaN);
	
	canPass = false;
	assert.throws(() => schemaChecked(NaN), 'SchemaMapper should throw errors on bad check.');
});

test('s.infinity test', t => {
	const schema = s.infinity();
	assert.strictEqual(s.parse(schema, Infinity), Infinity);
	assert.strictEqual(s.parse(schema, -Infinity), -Infinity);
	assert.strictEqual(s.parse(schema, 1/0), Infinity);
	assert.strictEqual(s.parse(schema, -1/0), -Infinity);

	assert.throws(() => schema(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.infinity({optional: true, default: Infinity});

	assert.strictEqual(s.parse(schemaOptional, Infinity), Infinity);
	assert.strictEqual(s.parse(schemaOptional, undefined), Infinity);
	assert.throws(() => schemaOptional('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.infinity({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, Infinity), Infinity);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaPositive = s.infinity({check: x => x > 0});

	assert.strictEqual(s.parse(schemaPositive, +Infinity), +Infinity);
	assert.strictEqual(s.parse(schemaPositive, -Infinity), NaN);
});

test('s.bigint test', t => {
	const schema = s.bigint();
	assert.strictEqual(s.parse(schema, 0n), 0n);
	assert.strictEqual(s.parse(schema, 1n), 1n);

	assert.throws(() => schema(1000), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.bigint({optional: true, default: 1n});

	assert.strictEqual(s.parse(schemaOptional, 0n), 0n);
	assert.strictEqual(s.parse(schemaOptional, 1n), 1n);
	assert.strictEqual(s.parse(schemaOptional, undefined), 1n);
	assert.throws(() => schemaOptional('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.bigint({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 0n), 0n);
	assert.strictEqual(s.parse(schemaNullable, 1n), 1n);
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaPositive = s.bigint({check: x => x > 0});

	assert.strictEqual(s.parse(schemaPositive, 10n), 10n);
	assert.strictEqual(s.parse(schemaPositive, -10n), NaN);

	const schemaRanged = s.bigint({min: 0, max: 10});

	assert.strictEqual(s.parse(schemaRanged, 0n), 0n);
	assert.strictEqual(s.parse(schemaRanged, 1n), 1n);
	assert.strictEqual(s.parse(schemaRanged, 10n), 10n);
	assert.strictEqual(s.parse(schemaRanged, 11n), NaN);
	assert.strictEqual(s.parse(schemaRanged, -1n), NaN);

	const schemaMapped = s.bigint({map: Number});

	assert.strictEqual(s.parse(schemaMapped, 0n), 0);
	assert.strictEqual(s.parse(schemaMapped, 1n), 1);
});

test('s.string test', t => {
	const schema = s.string();
	assert.strictEqual(s.parse(schema, ''), '');
	assert.strictEqual(s.parse(schema, 'aaa'), 'aaa');
	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaPrefix = s.string({prefix: 'abcd'});
	assert.strictEqual(s.parse(schemaPrefix, 'abcdefg'), 'abcdefg');
	assert.strictEqual(s.parse(schemaPrefix, 'abcd1234'), 'abcd1234');
	assert.throws(() => schemaPrefix(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schemaPrefix('something'), 'SchemaMapper should throw errors on bad value.');

	const schemaSuffix = s.string({suffix: 'xyz'});
	assert.strictEqual(s.parse(schemaSuffix, 'tuvwxyz'), 'tuvwxyz');
	assert.strictEqual(s.parse(schemaSuffix, '4321xyz'), '4321xyz');
	assert.throws(() => schemaSuffix(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schemaSuffix('something'), 'SchemaMapper should throw errors on bad value.');

	const schemaInfix = s.string({infix: 'ghi'});
	assert.strictEqual(s.parse(schemaInfix, 'abdcefghijkl'), 'abdcefghijkl');
	assert.strictEqual(s.parse(schemaInfix, '001-ghi-002'), '001-ghi-002');
	assert.throws(() => schemaInfix(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schemaInfix('something'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.string({optional: true, default: 'default'});

	assert.strictEqual(s.parse(schemaOptional, 'present'), 'present');
	assert.strictEqual(s.parse(schemaOptional, undefined), 'default');
	assert.throws(() => schemaOptional(7.62), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.string({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 'present'), 'present');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable(7.62), 'SchemaMapper should throw errors on bad value.');

	const schemaLength = s.string({min: 3, max: 5});

	assert.strictEqual(s.parse(schemaLength, 'abc'), 'abc');
	assert.strictEqual(s.parse(schemaLength, 'ab'), NaN);
	assert.strictEqual(s.parse(schemaLength, 'abcdef'), NaN);

	const schemaNoMatch = s.string({noMatch: /\d+/});

	assert.strictEqual(s.parse(schemaNoMatch, 'abc'), 'abc');
	assert.strictEqual(s.parse(schemaNoMatch, 'abc123'), NaN);
});

test('s.numericString test', t => {
	const schema = s.numericString({map: Number});
	const positive = s.numericString({map: Number, min: Number.EPSILON});
	const negative = s.numericString({map: Number, max: -Number.EPSILON});

	assert.strictEqual(s.parse(schema, '2.25'), 2.25);
	assert.strictEqual(s.parse(schema, '1000000'), 1000000);
	assert.strictEqual(s.parse(schema, '1.00'), 1.00);
	assert.strictEqual(s.parse(schema, '0x29a'), 0x29a);

	assert.strictEqual(s.parse(positive, '2.25'), 2.25);
	assert.strictEqual(s.parse(positive, '1000000'), 1000000);
	assert.strictEqual(s.parse(positive, '1.00'), 1.00);
	assert.strictEqual(s.parse(positive, '0x29a'), 0x29a);

	assert.strictEqual(s.parse(negative, '-2.25'), -2.25);
	assert.strictEqual(s.parse(negative, '-1000000'), -1000000);
	assert.strictEqual(s.parse(negative, '-1.00'), -1.00);

	assert.throws(() => schema('haha wow'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive(-10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative(-10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive(0), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative(0), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive('0'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative('0'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.numericString({optional: true, default: '0.00'});

	assert.strictEqual(s.parse(schemaOptional, '0.00'), '0.00');
	assert.strictEqual(s.parse(schemaOptional, '0.01'), '0.01');
	assert.strictEqual(s.parse(schemaOptional, undefined), '0.00');
	assert.throws(() => schemaOptional('not a number'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.numericString({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, '0.00'), '0.00');
	assert.strictEqual(s.parse(schemaNullable, '0.01'), '0.01');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('not a number'), 'SchemaMapper should throw errors on bad value.');
});

test('s.dateString test', t => {
	const schema = s.dateString();
	const after1994 = s.dateString({min: new Date('01/01/1995')});
	const before1995 = s.dateString({max: new Date('01/01/1995')});

	assert.deepEqual(s.parse(schema, '04 JUL 1995 17:00:00 EDT'), '04 JUL 1995 17:00:00 EDT');
	assert.deepEqual(s.parse(after1994, '04 JUL 1995 17:00:00 EDT'), '04 JUL 1995 17:00:00 EDT');
	assert.deepEqual(s.parse(before1995, '04 JUL 1995 17:00:00 EDT'), NaN);
	assert.deepEqual(s.parse(schema, '07/04/1995'), '07/04/1995');
	assert.deepEqual(s.parse(after1994, '07/04/1995'), '07/04/1995');

	assert.throws(() => schema({}), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => after1994(new Date('01/01/1989')), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('this is not a date'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.dateString({optional: true, default: '04 JUL 1995 17:00:00 EDT'});

	assert.strictEqual(s.parse(schemaOptional, '04 JUL 1995 17:00:00 EDT'), '04 JUL 1995 17:00:00 EDT');
	assert.strictEqual(s.parse(schemaOptional, undefined), '04 JUL 1995 17:00:00 EDT');
	assert.throws(() => schemaOptional('this is not a date'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.dateString({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, '04 JUL 1995 17:00:00 EDT'), '04 JUL 1995 17:00:00 EDT');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('this is not a date'), 'SchemaMapper should throw errors on bad value.');
});

test('s.uuidString test', t => {
	const schema = s.uuidString();
	assert.strictEqual(s.parse(schema, '00000000-0000-0000-0000-000000000000'), '00000000-0000-0000-0000-000000000000'); // nil
	assert.strictEqual(s.parse(schema, 'acd19070-6b92-11ef-b864-0242ac120002'), 'acd19070-6b92-11ef-b864-0242ac120002'); // v1
	assert.strictEqual(s.parse(schema, '0ff5d941-f46a-4f4a-aec8-1d1ec117e2a3'), '0ff5d941-f46a-4f4a-aec8-1d1ec117e2a3'); // v4
	assert.strictEqual(s.parse(schema, '0191c292-fc30-7223-b16c-85c30803cd4d'), '0191c292-fc30-7223-b16c-85c30803cd4d'); // v7
	assert.strictEqual(s.parse(schema, '6b22e05b-8764-4219-bc87-ee2c115a95eb'), '6b22e05b-8764-4219-bc87-ee2c115a95eb'); // gui

	assert.throws(() => schema('this is not a uuid'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.uuidString({optional: true, default: '6b22e05b-8764-4219-bc87-ee2c115a95eb'});

	assert.strictEqual(s.parse(schemaOptional, '6b22e05b-8764-4219-bc87-ee2c115a95eb'), '6b22e05b-8764-4219-bc87-ee2c115a95eb');
	assert.strictEqual(s.parse(schemaOptional, undefined), '6b22e05b-8764-4219-bc87-ee2c115a95eb');
	assert.throws(() => schemaOptional('this is not a UUID'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.uuidString({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, '6b22e05b-8764-4219-bc87-ee2c115a95eb'), '6b22e05b-8764-4219-bc87-ee2c115a95eb');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('this is not a UUID'), 'SchemaMapper should throw errors on bad value.');

	const schemaZeroPrefix = s.uuidString({check: x => x.match(/^0/)});

	assert.strictEqual(s.parse(schemaZeroPrefix, '00000000-0000-0000-0000-000000000000'), '00000000-0000-0000-0000-000000000000');
	assert.strictEqual(s.parse(schemaZeroPrefix, '10000000-0000-0000-0000-000000000000'), NaN);
});

test('s.urlString test', t => {
	const schema = s.urlString();
	assert.strictEqual(s.parse(schema, 'https://example.com'), 'https://example.com');
	assert.strictEqual(s.parse(schema, 'https://example.com/'), 'https://example.com/');
	assert.strictEqual(s.parse(schema, 'https://www.example.com/'), 'https://www.example.com/');
	assert.throws(() => schema('this is not a url'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.urlString({optional: true, default: 'https://example.com'});
	assert.strictEqual(s.parse(schemaOptional, 'https://example.com'), 'https://example.com');
	assert.strictEqual(s.parse(schemaOptional, undefined), 'https://example.com');
	assert.throws(() => schemaOptional('this is not a url'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.urlString({nullable: true});
	assert.strictEqual(s.parse(schemaNullable, 'https://example.com'), 'https://example.com');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('this is not a url'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.urlString({check: url => String(url).match(/^https/)});
	assert.strictEqual(s.parse(schemaCheck, 'https://example.com'), 'https://example.com');
	assert.strictEqual(s.parse(schemaCheck, 'http://example.com'), NaN);
});

test('s.emailString test', t => {
	const schema = s.emailString();
	assert.strictEqual(s.parse(schema, 'person@example.co'), 'person@example.co');
	assert.strictEqual(s.parse(schema, 'person@example.com'), 'person@example.com');
	assert.strictEqual(s.parse(schema, 'person@subdomain.example.com'), 'person@subdomain.example.com');
	assert.strictEqual(s.parse(schema, 'person@example.travel'), 'person@example.travel');
	assert.strictEqual(s.parse(schema, 'person.name@example.com'), 'person.name@example.com');

	assert.throws(() => schema('this is not an email'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@.'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@.c'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@example.'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@example.c'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person.example@com'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@person@example.com'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person.name@example'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.emailString({optional: true, default: 'someone@example.com'});

	assert.strictEqual(s.parse(schemaOptional, 'someone@example.com'), 'someone@example.com');
	assert.strictEqual(s.parse(schemaOptional, undefined), 'someone@example.com');
	assert.throws(() => schemaOptional('this is not an email'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.emailString({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 'someone@example.com'), 'someone@example.com');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('this is not an email'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.emailString({check: url => String(url).match(/^a/)});
	assert.strictEqual(s.parse(schemaCheck, 'a@example.com'), 'a@example.com');
	assert.strictEqual(s.parse(schemaCheck, 'b@example.com'), NaN);
});

test('s.regexString test', t => {
	const schema = s.regexString();
	assert.strictEqual(s.parse(schema, '^$'), '^$');
	assert.strictEqual(s.parse(schema, '.+?'), '.+?');

	assert.throws(() => schema(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('+++'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('***'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.regexString({optional: true, default: '^$'});

	assert.strictEqual(s.parse(schemaOptional, '^$'), '^$');
	assert.strictEqual(s.parse(schemaOptional, undefined), '^$');
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.regexString({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, '^$'), '^$');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.regexString({check: r => !r.match(/\./)});
	assert.strictEqual(s.parse(schemaCheck, '^$'), '^$');
	assert.strictEqual(s.parse(schemaCheck, '^.$'), NaN);
});

test('s.base64String test', t => {
	const schema = s.base64String();
	assert.strictEqual(s.parse(schema, 'RXhhbXBsZSBzdHJpbmc='), 'RXhhbXBsZSBzdHJpbmc=');

	assert.throws(() => schema(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('thisisinvalid=='), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.base64String({optional: true, default: 'RXhhbXBsZSBzdHJpbmc='});

	assert.strictEqual(s.parse(schemaOptional, 'RXhhbXBsZSBzdHJpbmc='), 'RXhhbXBsZSBzdHJpbmc=');
	assert.strictEqual(s.parse(schemaOptional, undefined), 'RXhhbXBsZSBzdHJpbmc=');
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.base64String({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, 'RXhhbXBsZSBzdHJpbmc='), 'RXhhbXBsZSBzdHJpbmc=');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.base64String({check: b64 => String(b64).length > 10});
	assert.strictEqual(s.parse(schemaCheck, 'RXhhbXBsZSBzdHJpbmc='), 'RXhhbXBsZSBzdHJpbmc=');
	assert.strictEqual(s.parse(schemaCheck, 'AQ=='), NaN);
});

test('s.jsonString test', t => {
	const schema = s.jsonString();
	assert.strictEqual(s.parse(schema, '1234'), '1234');
	assert.strictEqual(s.parse(schema, '"abcd"'), '"abcd"');
	assert.strictEqual(s.parse(schema, '{}'), '{}');
	assert.strictEqual(s.parse(schema, '[]'), '[]');
	assert.strictEqual(s.parse(schema, '[{}, 1, 2]'), '[{}, 1, 2]');

	assert.throws(() => schema('---'), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.jsonString({optional: true, default: '{}'});

	assert.strictEqual(s.parse(schemaOptional, '{}'), '{}');
	assert.strictEqual(s.parse(schemaOptional, undefined), '{}');
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.jsonString({nullable: true});

	assert.strictEqual(s.parse(schemaNullable, '{}'), '{}');
	assert.strictEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.jsonString({check: r => !r.match(/^\[/)});
	assert.strictEqual(s.parse(schemaCheck, '{}'), '{}');
	assert.strictEqual(s.parse(schemaCheck, '[]'), NaN);
});

test('s.array test', t => {
	const schema = s.array();
	assert.deepEqual(s.parse(schema, []), []);
	assert.deepEqual(s.parse(schema, [1, 2, 3]), [1, 2, 3]);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.array({optional: true, default: []});

	assert.deepEqual(s.parse(schemaOptional, []), []);
	assert.deepEqual(s.parse(schemaOptional, undefined), []);
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.array({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, []), []);
	assert.deepEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.array({check: a => a.length === 0});
	assert.deepEqual(s.parse(schemaCheck, []), []);
	assert.strictEqual(s.parse(schemaCheck, [0]), NaN);

	const schemaSized = s.array({min: 3, max: 5});
	assert.deepEqual(s.parse(schemaSized, [1, 2, 3]), [1, 2, 3]);
	assert.strictEqual(s.parse(schemaSized, [1, 2]), NaN);
	assert.strictEqual(s.parse(schemaSized, [1, 2, 3, 4, 5, 6]), NaN);

	const schemaMapped = s.array({map: a => a.map(x => x + 1000)});
	assert.deepEqual(s.parse(schemaMapped, [1, 2, 3]), [1001, 1002, 1003]);

	const schemaEached = s.array({each: x => x + 1000});
	assert.deepEqual(s.parse(schemaEached, [1, 2, 3]), [1001, 1002, 1003]);
});

test('s.object test', t => {
	const schema = s.object();
	assert.deepEqual(s.parse(schema, {}), {});
	assert.deepEqual(s.parse(schema, {a:1, b:2}), {a:1, b:2});

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.object({optional: true, default: {}});

	assert.deepEqual(s.parse(schemaOptional, {}), {});
	assert.deepEqual(s.parse(schemaOptional, undefined), {});
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.object({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, {}), {});
	assert.deepEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaCheck = s.object({check: o => 'id' in o});
	assert.deepEqual(s.parse(schemaCheck, {id: 1}), {id: 1});
	assert.strictEqual(s.parse(schemaCheck, {}), NaN);

	const schemaMapped = s.object({ map: o => ({...o, id: o.id + 1000}) });
	assert.deepEqual(s.parse(schemaMapped, {id: 1}), {id: 1001});

	const schemaEached = s.object({ each: ([k, v]) => [ k, v+1000 ]});
	assert.deepEqual(s.parse(schemaEached, {id: 1}), {id: 1001});
});

test('s.date test', t => {
	const schema = s.date();
	const after1995 = s.date({min: new Date('01/01/1996')});
	const before1997 = s.date({max: new Date('01/01/1996')});
	
	const date = new Date();
	assert.deepEqual(s.parse(schema, date), date);
	assert.deepEqual(s.parse(after1995, date), date);
	assert.deepEqual(s.parse(before1997, date), NaN);

	assert.throws(() => schema({}), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => after1995(new Date('01/01/1994')), 'SchemaMapper should throw errors on bad value.');

	const defaultDate = new Date;

	const schemaOptional = s.date({optional: true, default: defaultDate});

	assert.deepEqual(s.parse(schemaOptional, defaultDate), defaultDate);
	assert.deepEqual(s.parse(schemaOptional, undefined), defaultDate);
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	assert.deepEqual(s.parse(schemaOptional, defaultDate), defaultDate);
	assert.deepEqual(s.parse(schemaOptional, undefined), defaultDate);
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.date({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, defaultDate), defaultDate);
	assert.deepEqual(s.parse(schemaNullable, null), null);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');
});

test('s.function test', t => {
	const schema = s.function();
	const funcA = () => {};
	const funcB = () => {};
	assert.strictEqual(s.parse(schema, funcA), funcA);
	assert.strictEqual(s.parse(schema, funcB), funcB);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.function({optional: true, default: funcA});

	assert.deepEqual(s.parse(schemaOptional, undefined), funcA);
	assert.deepEqual(s.parse(schemaOptional, funcB), funcB);
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.function({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, null), null);
	assert.deepEqual(s.parse(schemaNullable, funcB), funcB);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	function Wrapped(func) {
		const ret = func.bind({});
		Object.setPrototypeOf(ret, this);
		return ret;
	};
	
	Object.setPrototypeOf(Wrapped.prototype, Function);
	
	const unwrappedA = () => 100;
	const wrappedA = new Wrapped(unwrappedA);

	const schemaCheck = s.function({check: f => f instanceof Wrapped});
	assert.deepEqual(s.parse(schemaCheck, wrappedA), wrappedA);
	assert.deepEqual(s.parse(schemaCheck, unwrappedA), NaN);

	const schemaMapped = s.function({ map: f => new Wrapped(f) });
	assert.ok(s.parse(schemaMapped, () => {}) instanceof Wrapped)
});

test('s.symbol test', {skip: major < 20 ? 'https://github.com/nodejs/node/issues/49135' : false}, t => {
	const schema = s.symbol();
	const symA = Symbol('a');
	const symB = Symbol('b');
	assert.strictEqual(s.parse(schema, symA), symA);
	assert.strictEqual(s.parse(schema, symB), symB);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaOptional = s.symbol({optional: true, default: symA});

	assert.deepEqual(s.parse(schemaOptional, undefined), symA);
	assert.deepEqual(s.parse(schemaOptional, symB), symB);
	assert.throws(() => schemaOptional('+++'), 'SchemaMapper should throw errors on bad value.');

	const schemaNullable = s.symbol({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, null), null);
	assert.deepEqual(s.parse(schemaNullable, symB), symB);
	assert.throws(() => schemaNullable('+++'), 'SchemaMapper should throw errors on bad value.');

	const symBanned = Symbol('banned');

	const schemaCheck = s.symbol({check: s => s !== symBanned});
	assert.deepEqual(s.parse(schemaCheck, symA), symA);
	assert.deepEqual(s.parse(schemaCheck, symBanned), NaN);

	const randomObject = {};
	const schemaMapped = s.symbol({ map: s => randomObject });
	assert.strictEqual(s.parse(schemaMapped, symA), randomObject);
});

test('s.null test', t => {
	const schema = s.null();
	assert.strictEqual(s.parse(schema, null), null);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaDefault = s.null({optional: true, default: 'NOT PROVIDED'});
	assert.strictEqual(s.parse(schemaDefault, null), null);
	assert.strictEqual(s.parse(schemaDefault, undefined), 'NOT PROVIDED');

	const schemaMapped = s.null({map: x => 0});
	assert.strictEqual(s.parse(schemaMapped, null), 0);
});

test('s.undefined test', t => {
	const schema = s.undefined();
	assert.strictEqual(s.parse(schema, undefined), undefined);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaDefault = s.undefined({optional: true, default: 'NOT PROVIDED'});
	assert.strictEqual(s.parse(schemaDefault, undefined), 'NOT PROVIDED');

	const schemaMapped = s.undefined({map: x => 0});
	assert.strictEqual(s.parse(schemaMapped, undefined), 0);

	const schemaNullable = s.undefined({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, undefined), undefined);
	assert.deepEqual(s.parse(schemaNullable, null), null);
});

test('s.literal test', t => {
	const schema = s.literal({value: 123});
	assert.strictEqual(s.parse(schema, 123), 123);
	assert.throws(() => schema(321));
});

test('s.overwrite test', t => {
	const schema = s.overwrite({value: 321});
	assert.strictEqual(s.parse(schema, 123), 321);
	assert.strictEqual(s.parse(schema, 'some value'), 321);
});

test('s.value test', t => {
	const schema = s.value();
	assert.strictEqual(s.parse(schema, 123), 123);
	assert.strictEqual(s.parse(schema, 'some value'), 'some value');

	const schemaDefault = s.value({optional: true, default: 'NOT PROVIDED'});
	assert.strictEqual(s.parse(schemaDefault, null), null);
	assert.strictEqual(s.parse(schemaDefault, undefined), 'NOT PROVIDED');

	const schemaNullable = s.value({nullable: true});

	assert.deepEqual(s.parse(schemaNullable, undefined), undefined);
	assert.deepEqual(s.parse(schemaNullable, null), null);

	const schemaEven = s.value({check: x => x % 2 === 0});

	assert.strictEqual(s.parse(schemaEven, 0), 0);
	assert.strictEqual(s.parse(schemaEven, 1), NaN);
	assert.strictEqual(s.parse(schemaEven, 2), 2);
	assert.strictEqual(s.parse(schemaEven, 3), NaN);

	const schemaMapped = s.value({map: x => x + 1000});
	assert.strictEqual(s.parse(schemaMapped, 0), 1000);
	assert.strictEqual(s.parse(schemaMapped, 1), 1001);
	assert.strictEqual(s.parse(schemaMapped, 2), 1002);
	assert.strictEqual(s.parse(schemaMapped, 3), 1003);
});

test('s.oneOf test', t => {
	const schema = s.oneOf(['something', 'something else', 'a secret third thing', 1234]);

	assert.strictEqual(s.parse(schema, 1234), 1234);
	assert.strictEqual(s.parse(schema, 'something'), 'something');
	assert.strictEqual(s.parse(schema, 'something else'), 'something else');
	assert.strictEqual(s.parse(schema, 'a secret third thing'), 'a secret third thing');

	assert.throws(() => schema(new Event('not on the list')), 'SchemaMapper should throw errors on bad value.');

	const schemaMapped = s.oneOf([1234], {map: x => x + 1});

	assert.strictEqual(s.parse(schemaMapped, 1234), 1235);
});

test('s.drop test', t => {
	const schema = s.drop();
	assert.strictEqual(s.parse(schema, 123), undefined);
	assert.strictEqual(s.parse(schema, 'some value'), undefined);
});

test('s.object dateSchema test', t => {
	const dateSchema = s.object({class: Date});
	const date = new Date;
	assert.strictEqual(s.parse(dateSchema, date), date);

	assert.throws(() => dateSchema(new Event('something')), 'SchemaMapper should throw errors on bad value.');
});

test('s.or test', t => {
	const schema = s.or(s.boolean(), s.string());
	assert.strictEqual(s.parse(schema, false), false);
	assert.strictEqual(s.parse(schema, true), true);

	assert.strictEqual(s.parse(schema, ''), '');
	assert.strictEqual(s.parse(schema, 'string'), 'string');

	assert.throws(() => schema(321), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema({}), 'SchemaMapper should throw errors on bad value.');
});

test('s.or param test', t => {
	const schema = s.or(
		s.string({match: /\d\d \w+ \d\d\d\d \d\d:\d\d:\d\d \w+?/})
		, s.object({class: Date})
	);

	const dateObject = new Date;
	const dateString = '04 Apr 1995 00:12:00 GMT';

	assert.strictEqual(s.parse(schema, dateObject), dateObject);
	assert.strictEqual(s.parse(schema, dateString), dateString);

	assert.throws(() => schema([]), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('bad string'), 'SchemaMapper should throw errors on bad value.');
});

test('s.and param test', t => {

	const schema = s.and(
		s.string({match: /0+/})
		, s.numericString()
	);

	const numericString = '00000';

	assert.strictEqual(s.parse(schema, numericString), numericString);

	assert.throws(() => schema([]), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('bad string'), 'SchemaMapper should throw errors on bad value.');
});

test('s.not param test', t => {

	const schema = s.not(
		s.numericString()
	);

	assert.strictEqual(s.parse(schema, 'Non numeric string'), 'Non numeric string');

	assert.throws(() => schema('0000'), 'SchemaMapper should throw errors on bad value.');
});

await test('s.asyncVal test', async t => {

	const schema = s.asyncVal( s.number() );

	assert.strictEqual(await schema( Promise.resolve(123)), 123);

	assert.rejects(
		() => schema(Promise.resolve('not a number')),
		'SchemaMapper should throw errors on bad value.'
	);
});

test('s.repeat test', t => {
	const schema = s.null();
	const schemas = s.repeat(5, schema);

	assert.strictEqual(schemas.length, 5);
	assert.strictEqual(schemas[0], schema);
	assert.strictEqual(schemas[1], schema);
	assert.strictEqual(schemas[2], schema);
	assert.strictEqual(schemas[3], schema);
	assert.strictEqual(schemas[4], schema);
});

//* @todo test s.parse

test('usersSchema test', t => {
	const users = JSON.parse(fs.readFileSync('test/users.json', {encoding: 'utf-8'}));

	const usersSchema = s.nTuple(
		s.sRecord({
			id: s.number({}),
			name: s.string({
				map: s => Tuple(...s.split(' '))
			}),
			username: s.string(),
			email: s.string(),
			address: s.sDict({
				street: s.string(),
				suite: s.string(),
				city: s.string(),
				zipcode: s.string({match: /\d{5}(-\d{4})?/, map: s => Tuple(...s.split('-'))}),
				geo: s.sRecord({
					lat: s.string({map: Number}),
					lng: s.string({map: Number}),
				}),
			}),
			phone: s.string({map: phone => Tuple(...phone.split(/\W+/).filter(x => x))}),
			website: s.string({map: s => String(new URL('https://' + s))}),
			company: s.sDict({
				name: s.string(),
				catchPhrase: s.string(),
				bs: s.string(),
			}),
		})
	);

	const usersA = usersSchema(JSON.parse(JSON.stringify(users)));
	const usersB = usersSchema(JSON.parse(JSON.stringify(users)));

	assert.strictEqual(usersA, usersB);
	assert.strictEqual(usersA[0], usersB[0]);
	assert.strictEqual(usersA[9], usersB[9]);

	assert.notEqual(usersA[0], usersB[1]);
});
