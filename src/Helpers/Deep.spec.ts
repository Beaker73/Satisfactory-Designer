import { describe, test, expect } from "vitest";
import { deepFreeze, deepMerge } from "./Deep";

describe("deepFreeze", () => 
{
	test("basic object will not freeze", () => 
	{
		const subject = 5;
		let result = deepFreeze(subject);
		expect(result).toBe(subject);
		expect(result).toEqual(5);
		result = 3;
	});

	test("complex object will freeze", () => 
	{
		const subject = { banana: "fruit", count: 8 };
		const result = deepFreeze(subject) as { banana: string, count: number}; // during test we make TYPE modifiable again
		const action = () => result.banana = "crash";
		expect(action).toThrow();
	});
	test("nested object will freeze", () =>
	{
		const subject = { banana: "fruit", pricing: { count: 8, price: 5.99 } };
		const result = deepFreeze(subject) as typeof subject;
		const action = () => result.pricing.count = 3;
		expect(action).toThrow();
	});
});

describe("deepMerge", () => 
{
	test("merge two simple objects", () => 
	{ 
		const one = { banana: "fruit", count: 8 };
		const other = { count: 3, price: 5.99 };
		const result = deepMerge(one, other);
		expect(result).toEqual({ banana: "fruit", count: 3, price: 5.99 });
	});
	test("merge two cmplex objects", () => 
	{ 
		const one = { 
			banana: "fruit", 
			pricing: { 
				count: 3, 
				price: 5.99, 
				tags: ["foo", "bar"],
			},
		};
		const other = { 
			pricing: { 
				count: 8, 
				tags: ["baz"],
			},
			newThing: "new",
		};
		const result = deepMerge(one, other);
		expect(result).toEqual({ 
			banana: "fruit", 
			pricing: { 
				count: 8, // new overwrites old
				price: 5.99, // old remains
				tags: ["foo", "bar", "baz"], // array merged
			},
			newThing: "new", // new things added
		});
	});
});