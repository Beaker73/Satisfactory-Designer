import { describe, expect, test } from "vitest";
import { raceAll } from "./Async";

describe("raceAll", () => 
{
	test("simple test", async () => 
	{
		let r1: () => void = () => {/** */ };
		let r2: () => void = () => {/** */ };
		let r3: () => void = () => {/** */ };

		const p1 = new Promise<number>(resolve => { r1 = () => resolve(1); });
		const p2 = new Promise<number>(resolve => { r2 = () => resolve(2); });
		const p3 = new Promise<number>(resolve => { r3 = () => resolve(3); });

		const p = raceAll<number>(p1, p2, p3);

		// trigger 2nd first
		r2();
		let i = 0;

		for await (const r of p) 
		{
			switch (i) 
			{
				case 0:
					expect(r).toBe(2);
					r1();
					i++;
					break;
				case 1:
					expect(r).toBe(1);
					r3();
					i++;
					break;
				case 2:
					expect(r).toBe(3);
					break;

			}
		}
	});
});