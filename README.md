# libtuple-schema

A `Schema` allows you to define a complex structure for your immutables. It is defined by one or more `SchemaMapper` functions, which take a value and will either return it, or throw an error:

```javascript
import { Schema as s } from 'libtuple-schema';

const boolSchema = s.boolean(); // returns the boolean SchemaMapper

boolSchema(true);  // returns true
boolSchema(false); // returns false
boolSchema(123);   // throws an error
```

> ### I am giving up my bed for one night.
> My Sleep Out helps youth facing homelessness find safe shelter and loving care at Covenant House. That care includes essential services like education, job training, medical care, mental health and substance use counseling, and legal aid — everything they need to build independent, sustainable futures.
>
> By supporting my Sleep Out, you are supporting the dreams of young people overcoming homelessness.
> 
> <a href = "https://www.sleepout.org/participants/62915"><img width = "50%" alt="Donate to Covenant House" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fwww.sleepout.org%2Fapi%2F1.3%2Fparticipants%2F62915%3F_%3D1760039017428&query=%24.sumDonations&prefix=%24&suffix=%20Raised&style=for-the-badge&label=Sleep%20Out%3A%20NYC&link=https%3A%2F%2Fwww.sleepout.org%2Fparticipants%2F62915"></a>
>
> Click here to help out: https://www.sleepout.org/participants/62915
>
> More info: https://www.sleepout.org/ | https://www.covenanthouse.org/ | https://www.charitynavigator.org/ein/132725416
> 
> Together, we are working towards a future where every young person has a safe place to sleep.
>
> Thank you.
>
> and now back to your documentation...

You can create schemas for Tuples, Groups, Records, and Dicts:

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.tuple(
    s.number(),
    s.number(),
);

const pointTuple = pointSchema([5, 10]);

console.log(pointTuple);

const userSchema = s.record({
    id: s.number(),
    email: s.string(),
});

const userRecord = userSchema({id: 1, email: 'fake@example.com'});

console.log(userRecord);
```

## Schema.parse(schema, value)

`Schema.parse()` will return the parsed value, or NaN on error, since `NaN` is falsey, and `NaN !== NaN`.

```javascript
import { Schema as s } from 'libtuple';

const boolSchema = s.boolean();

s.parse(boolSchema, true);  // returns true
s.parse(boolSchema, false); // returns false
s.parse(boolSchema, 123);   // returns NaN
```

## SchemaMappers

### SchemaMappers for Values

#### Schema.value(options)

Validate an arbitrary value.

* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.literal(options)

Validate a literal value. Must be strictly equal.

* options.value - The value to check.

#### Schema.overwrite(options)

Overwrite a value.

* options.value - The value to return.
* options.map - Callback to transform the value.

#### Schema.drop()

Drop the value (always maps to `undefined`).

#### Schema.boolean(options)

Validate a boolean.

* options.map - Callback to transform the value after its been validated.

#### Schema.number(options)

* options.min - Min value
* options.max - Max value
* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.bigint(options)

* options.min - Min value
* options.max - Max value
* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.string(options)

* options.min - Min length
* options.max - Max length
* options.map - Callback to transform the value after its been validated.
* options.match - Throw a TypeError if this does NOT match
* options.noMatch - Throw a TypeError if this DOES match
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.array(options)

* options.min - Min length
* options.max - Max length
* options.map - Callback to transform the value after its been validated.
* options.each - Callback to transform each element.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.object(options)

* options.class - Throw a TypeError if the class does not match.
* options.map - Callback to transform the value after its been validated.
* options.each - Callback to transform each element.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.function(options)

* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.symbol(options)

* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.
* options.nullable - Is this value nullable?
* options.optional - Is this value optional?
* options.default - If the value is optional & undefined or missing, use this value.

#### Schema.null(options)

* options.map - Callback to transform the value after its been validated.

#### Schema.undefined(options)

* options.map - Callback to transform the value after its been validated.

---

### Schema Mappers for Convenience

#### Convenience methods for numbers

The following methods will call `s.number` with additional constraints added:

* s.integer
* s.float
* s.NaN
* s.infinity

#### Convenience methods for strings

The following methods will call `s.string` with additional constraints added:

* s.numericString
    ```javascript
    // options.min & options.max are overridden for numeric comparison.
    const positive = s.numericString({map: Number, min: Number.EPSILON});
	const negative = s.numericString({map: Number, max: -Number.EPSILON});

    negative('-100'); // -100
    positive('100');  //  100

    negative('5');    // ERROR
    positive('-5');   // ERROR
    ```
* s.dateString
    ```javascript
    // options.min & options.max are overridden for comparison with Date objects.
    const after1994 = s.dateString({min: new Date('01/01/1995')});

    after1994('07/04/1995'); // '07/04/1995'
    after1994('07/04/1989'); // ERROR
    ```
* s.uuidString
    ```javascript
    const uuidSchema = s.uuidString();
	uuidSchema('0ff5d941-f46a-4f4a-aec8-1d1ec117e2a3'); // '0ff5d941-f46a-4f4a-aec8-1d1ec117e2a3'
    uuidSchema('0ff5d941'); // ERROR
    ```
* s.urlString
    ```javascript
    const urlSchema = s.urlString();
	urlSchema('https://example.com'); // 'https://example.com'
    urlSchema('not a url');           // ERROR
    ```
* s.emailString
    ```javascript
    const emailSchema = s.emailString();
	emailSchema('person@example.com'); // 'person@example.com'
    emailSchema('not an email');       // ERROR
    ```
* s.regexString
    ```javascript
    const regexSchema = s.regexString();
	regexSchema('.+?'); // '.+?'
    regexSchema('+++'); // ERROR
    ```
* s.base64String
    ```javascript
    const base64Schema = s.base64String();
    base64Schema('RXhhbXBsZSBzdHJpbmc='); // 'RXhhbXBsZSBzdHJpbmc='
    base64Schema('notbase64');            // ERROR;
    ```
* s.jsonString
    ```javascript
    const jsonSchema = s.jsonString();
    jsonSchema('[0, 1, 2]'); // '[0, 1, 2]';
    jsonSchema('not json');  // ERROR;
    ```

### Special Schema Mappers

#### Schema.and(...schemaMappers)

Run the value through each SchemaMapper in sequence.  Passes only if _all_ mappers succeed, returning the last mapped value.

```javascript
import { Schema as s } from 'libtuple';

const schema = s.and(
  s.string(),
  s.oneOf(['foo', 'bar', 'baz'])
);

console.log(s.parse(schema, 'foo')); // 'foo'
s.parse(schema, 'XYZ');              // NaN (fails to match oneOf clause)
```
#### Schema.or(...schemaMappers)

Map the value with the first matching SchemaMapper

```javascript
import { Schema as s } from 'libtuple';

const dateSchema = s.or(
    s.string({match: /\d\d \w+ \d\d\d\d \d\d:\d\d:\d\d \w+?/, map: s => new Date(s)}),
    s.object({class: Date})
);

console.log( dateSchema('04 Apr 1995 00:12:00 GMT') );
console.log( dateSchema(new Date) );
```

#### Schema.not(schemaMapper)

Invert a SchemaMapper: succeeds only if the mapper throws, returning the original value.

```javascript
import { Schema as s } from 'libtuple';

const schema = s.not(
  s.string({match: /^foo/})
);

console.log(s.parse(schema, 'bar')); // 'bar'
s.parse(schema, 'foobar');           // NaN (starts with 'foo')
```

#### Schema.repeat(r, schemaMapper)

Repeat a SchemaMapper n times

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.tuple(...s.repeat(2, s.number()));

const point = pointSchema([5, 10]);
```

#### Schema.oneOf(literals = [], options = {})

Match the value to a set of literals with strict-equals comparison.

```javascript
import { Schema as s } from 'libtuple';

const schema = s.oneOf(['something', 1234]);

s.parse(schema, 1234);          // 1234
s.parse(schema, 'something');   // 'something'
s.parse(schema, 'not on list'); // ERROR!
```

#### Schema.asyncVal(schemaMapper)

Convert a SchemaMapper so it accepts a Promise as input and awaits it.

```javascript
import { Schema as s } from 'libtuple';

const schema = s.asyncVal(s.number());

(async () => {
  console.log(await schema(Promise.resolve(123))); // 123
})();
```

---

### Schema Mappers for Tuples, Groups, Records and Dicts

#### Schema.tuple(...values)

Map one or more values to a Tuple.

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.tuple(s.number(), s.number());

const point = pointSchema([5, 10]);
```

#### Schema.group(...values)

Map one or more values to a Group.

#### Schema.record(properties)

Map one or more properties to a Record.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.sRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
});

console.log({company});
```

#### Schema.dict(properties)

Map one or more values to a Dict.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.sDict({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
});

console.log({company});
```

#### Schema.nTuple(...values)

Map n values to a Tuple. Will append each value in the input to the Tuple using the same mapper.

```javascript
import { Schema as s } from 'libtuple';

const vectorSchema = s.nTuple(s.number());

const vec2 = vectorSchema([5, 10]);
const vec3 = vectorSchema([5, 10, 11]);
const vec4 = vectorSchema([5, 10, 11, 17]);

console.log({vec2, vec3, vec4});
```

#### Schema.nGroup(...values)

Map n values to a Group. Will append each value in the input to the Group using the same mapper.

#### Schema.nRecord(properties)

Map an array of objects to a Tuple of Records.  If passed a single object, it is coerced into a one-element tuple.

```javascript
import { Schema as s } from 'libtuple';

const usersSchema = s.nRecord({
  id:   s.number(),
  name: s.string(),
});

const users = usersSchema([
  { id: 1, name: 'Alice', extra: 1234 },
  { id: 2, name: 'Bob' }
]);

console.log(users);
// Tuple(
//   Record({id:1, name:'Alice', extra: 1234}),
//   Record({id:2, name:'Bob'})
// )
```

#### Schema.nDict(properties)

Map an array of objects to a Tuple of Dicts.  If passed a single object, it is coerced into a one-element tuple.

```javascript
import { Schema as s } from 'libtuple';

const configsSchema = s.nDict({
  mode: s.string(),
  flag: s.boolean(),
});

const configs = configsSchema([
  { mode: 'dev', flag: true, extra: 'ignored' },
  { mode: 'prod', flag: false }
]);

console.log(configs);
// Tuple(
//   Dict({mode:'dev', flag:true, extra:'ignored'}),
//   Dict({mode:'prod', flag:false})
// )
```

#### Schema.sTuple(...values)

Strictly map values to a Tuple. Will throw an error if the number of values does not match.

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.sTuple(s.number(), s.number());

const pointA = pointSchema([5, 10]);
const pointB = pointSchema([5, 10, 1]); // ERROR!
```

#### Schema.sGroup(...values)

Strictly map values to a Group. Will throw an error if the number of values does not match.

#### Schema.sRecord(properties)

Strictly map values to a Record. Will throw an error if the number of values does not match.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.nRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
});

// ERROR!
companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
    openHours: '9AM-7PM',
    slogan: 'We do business.',
});
```

#### Schema.sDict(properties)

Strictly map values to a Dict. Will throw an error if the number of values does not match.

#### Schema.xTuple(...values)

Exclusively map values to a Tuple. Will drop any keys not present in the schema.

```javascript
import { Schema as s } from './index.mjs';

const pointSchema = s.xTuple(s.number(), s.number());

const pointA = pointSchema([5, 10]); // [5, 10]
const pointB = pointSchema([5, 10, 1]); // Also [5, 10]

console.log(pointB[0]); // 5
console.log(pointB[1]); // 10
console.log(pointB[2]); // undefined

```

#### Schema.xGroup(...values)

Exclusively map values to a Group. Will drop any keys not present in the schema.

#### Schema.xRecord(properties)

Exclusively map values to a Record. Will drop any keys not present in the schema.

```javascript
const companySchema = s.xRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
    openHours: '9AM-7PM',
    slogan: 'We do business.',
});

console.log({company});
```

#### Schema.xDict(properties)

Exclusively map values to a Dict. Will drop any keys not present in the schema.

---