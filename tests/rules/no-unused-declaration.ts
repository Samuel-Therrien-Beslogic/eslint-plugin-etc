/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-unused-declaration");
import { ruleTester } from "../utils";

const message = (name: string) => ({
  messageId: "forbidden",
  data: {
    name,
  },
});

ruleTester({ types: true }).run("no-unused-declaration", rule, {
  valid: [
    {
      code: stripIndent`
        // any
        const a = "a";
        let b = "b";
        var c = "c";

        const d: any = { a, b, c };
        console.log(d.e);
      `,
    },
    {
      code: stripIndent`
        // exported
        export const a = "a";
        export let b = "b";
        export var c = "c";

        export function f(): void {}
        export function g(): void {}

        export class Person {}
        export enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
      `,
    },
    {
      code: stripIndent`
        // ignored
        /* @jsx jsx */
        import { jsx } from "@emotion/core";

        export const Component = () => <span>Component</span>;
      `,
      options: [
        {
          ignored: {
            jsx: true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // used classes
        class Person {}

        console.log(new Person());
      `,
    },
    {
      code: stripIndent`
        // used destructuring
        const instance = { property: 42 };
        const array = [54];

        console.log(instance, array);

        const { property } = instance;
        const { property: renamed } = instance;
        const [element] = array;

        function f({ name }: { name?: string }): void {}
        function g({ name: renamed }: { name?: string }): void {}

        console.log(property, renamed, element, f.toString(), g.toString());

        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };

        console.log(a, b, rest);
      `,
    },
    {
      code: stripIndent`
        // used enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }

        console.log(WTF.FILE_NOT_FOUND);
      `,
    },
    {
      code: stripIndent`
        // used const enums
        const enum WTF { TRUE, FALSE, FILE_NOT_FOUND }

        console.log(WTF.FILE_NOT_FOUND);
      `,
    },
    {
      code: stripIndent`
        // used functions object shorthand
        function a(): void {}

        function b(x: string): void;
        function b(x: number, y: number): void;
        function b(...args: any[]): void {}

        const c = { a, b, d };
        console.log(c);

        function d(): void {}
      `,
    },
    {
      code: stripIndent`
        // used functions
        function f(): void {}
        const g = () => {};

        console.log(f.toString(), g.toString());
      `,
    },
    {
      code: stripIndent`
        // used imports object calculated
        import { a, b, c } from "./letters";

        const d = { [a]: a, [b]: "b", ["c"]: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used imports object properties
        import { a, b, c } from "./letters";

        const d = { a: a, b: b, c: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used imports object shorthand
        import { a, b, c } from "./letters";

        const d = { a, b, c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used imports
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        console.log(a, alias, l.a, letters, L, e);
      `,
    },
    {
      code: stripIndent`
        // used types
        interface SomeInterface {}
        type SomeType = {};

        declare const a: SomeInterface;
        declare const b: SomeType;

        console.log(a, b);
      `,
    },
    {
      code: stripIndent`
        // used base class
        import { Base } from "./base";

        export class Derived extends Base {}
      `,
    },
    {
      code: stripIndent`
        // used base interface
        import { Base } from "./base";

        export interface Derived extends Base {}
      `,
    },
    {
      code: stripIndent`
        // exported types
        export interface SomeInterface {}
        export type SomeType = {};
      `,
    },
    {
      code: stripIndent`
        // used type imports
        import { Thing } from "./thing";

        const t: Thing | null = null;
        console.log(t);
      `,
    },
    {
      code: stripIndent`
        // used qualified type imports
        import { Thing } from "./thing";

        const t: Thing.Name | null = null;
        console.log(t);
      `,
    },
    {
      code: stripIndent`
        // used variables object calculated
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { [a]: a, [b]: "b", ["c"]: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used variables object properties
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { a: a, b: b, c: c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used variables object shorthand
        const a = "a";
        let b = "b";
        var c = "c";

        const d = { a, b, c };
        console.log(d);
      `,
    },
    {
      code: stripIndent`
        // used variables
        const a = "a";
        let b = "b";
        var c = "c";

        console.log(a, b, c);
      `,
    },
    {
      code: stripIndent`
        // used JSX components
        import React from "react";
        import { Thing } from "./thing";

        export const OpenCloseThing = ({ children, ...props }) => <Thing {...props}>{children}</Thing>;
        export const SelfCloseThing = props => <Thing {...props}/>;
      `,
      options: [
        {
          ignored: {
            React: true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // used JSX namespace components
        import React from "react";
        import * as Icons from "./icons";

        export const App = () => {
          return <div>
            <Icons.One/>
            <Icons.Two/>
          </div>
        };
      `,
      options: [
        {
          ignored: {
            React: true,
          },
        },
      ],
    },
    {
      code: stripIndent`
        // used within class scope
        let draging = false;
        let popupVisible = false;

        export class DragAndDropStore {
          isDraging = () => draging;
          isPopupVisible = () => popupVisible;
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/3
        export const h = hoisted();
        function hoisted(): number { return 42; }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/cartant/tslint-etc/issues/6
        import { other } from "./other";
        export { other };

        const another = "another";
        export { another };
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // only declarations
        import { a } from "./letters";
        import { a as alias } from "./letters";
        import * as l from "./letters";
        import letters from "./letters";
        import L, { e } from "./letters";

        const x = "x";
              ~ [forbidden]
        const [y] = ["y"];
               ~ [forbidden]
        const { z } = { z: "z" };
                ~ [forbidden]
      `,
      {},
      {
        options: [
          {
            declarations: true,
            imports: false,
          },
        ],
        output: stripIndent`
          // only declarations
          import { a } from "./letters";
          import { a as alias } from "./letters";
          import * as l from "./letters";
          import letters from "./letters";
          import L, { e } from "./letters";

          const x = "x";
          const [y] = ["y"];
          const { z } = { z: "z" };
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // only imports
        import { a } from "./letters";
                 ~ [forbidden]
        import { a as alias } from "./letters";
                      ~~~~~ [forbidden]
        import * as l from "./letters";
                    ~ [forbidden]
        import letters from "./letters";
               ~~~~~~~ [forbidden]
        import L, { e } from "./letters";
               ~ [forbidden]
                    ~ [forbidden]
        const x = "x";
        const [y] = ["y"];
        const { z } = { z: "z" };
      `,
      {},
      {
        options: [
          {
            declarations: false,
            imports: true,
          },
        ],
        // TODO:
        // output: stripIndent`
        //   // only imports
        //   const x = "x";
        //   const [y] = ["y"];
        //   const { z } = { z: "z" };
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // reassigned
        const a = "a";
        let b = "b";
            ~ [forbidden]
        var c = "c";
            ~ [forbidden]

        b = a;
        c = a;
      `,
      {},
      {
        output: stripIndent`
          // reassigned
          const a = "a";
          let b = "b";
          var c = "c";

          b = a;
          c = a;
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // shadowed
        import { b } from "./letters";
                 ~ [forbidden]
        const a = "a";
              ~ [forbidden]

        export function f(a: string, b: string): void {
          console.log(a, b);
        }
      `,
      {},
      {
        // TODO:
        // output: stripIndent`
        //   // shadowed
        //   const a = "a";
        //
        //   export function f(a: string, b: string): void {
        //     console.log(a, b);
        //   }
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // some used imports
        import { a, b, c } from "./letters";
                 ~ [forbidden]
                       ~ [forbidden]
        import {
          a as apple,
               ~~~~~ [forbidden]
          b as banana,
          c as cherry
               ~~~~~~ [forbidden]
        } from "./letters";

        import t, { d } from "./letters";
                    ~ [forbidden]
        import u, { e as egg } from "./letters";
                         ~~~ [forbidden]
        import v, { f } from "./letters";
               ~ [forbidden]
                    ~ [forbidden]
        import w, { g as grape } from "./letters";
               ~ [forbidden]
                         ~~~~~ [forbidden]
        console.log(b, banana, t, u);
      `,
      {},
      {
        // TODO:
        // output: stripIndent`
        //   // some used imports
        //   import { b } from "./letters";
        //   import {
        //     b as banana
        //   } from "./letters";
        //
        //   import t from "./letters";
        //   import u from "./letters";
        //
        //   console.log(b, banana, t, u);
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // unused classes
        class Person {}
              ~~~~~~ [forbidden]
      `,
      {},
      {
        output: stripIndent`
          // unused classes
          class Person {}
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused destructuring
        const instance = { property: 42 };
        const array = [54];

        console.log(instance, array);

        const { property } = instance;
                ~~~~~~~~ [forbidden]
        const { property: renamed } = instance;
                          ~~~~~~~ [forbidden]
        const [element] = array;
               ~~~~~~~ [forbidden]

        function f({ name }: { name?: string }): void {}
        function g({ name: renamed }: { name?: string }): void {}

        console.log(f.toString(), g.toString());

        const { a, b, ...rest } = { a: 1, b: 2, c: 3 };
                   ~ [forbidden]
                         ~~~~ [forbidden]

        console.log(a);
      `,
      {},
      {
        output: stripIndent`
          // unused destructuring
          const instance = { property: 42 };
          const array = [54];

          console.log(instance, array);

          const { property } = instance;
          const { property: renamed } = instance;
          const [element] = array;

          function f({ name }: { name?: string }): void {}
          function g({ name: renamed }: { name?: string }): void {}

          console.log(f.toString(), g.toString());

          const { a, b, ...rest } = { a: 1, b: 2, c: 3 };

          console.log(a);
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused enums
        enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
             ~~~ [forbidden]
      `,
      {},
      {
        output: stripIndent`
          // unused enums
          enum WTF { TRUE, FALSE, FILE_NOT_FOUND }
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused functions
        function f(): void {}
                 ~ [forbidden]
        const g = () => {};
              ~ [forbidden]
      `,
      {},
      {
        output: stripIndent`
          // unused functions
          function f(): void {}
          const g = () => {};
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused imports
        import { a } from "./letters";
                 ~ [forbidden]
        import { b } from "./letters";
        import { c, d } from "./letters";
                 ~ [forbidden]
                    ~ [forbidden]
        import { a as anise } from "./letters";
                      ~~~~~ [forbidden]
        import { b as basil } from "./letters";
        import {
          c as carrot,
               ~~~~~~ [forbidden]
          d as dill
               ~~~~ [forbidden]
        } from "./letters";
        import * as l from "./letters";
                    ~ [forbidden]
        import letters from "./letters";
               ~~~~~~~ [forbidden]
        import L, { e } from "./letters";
               ~ [forbidden]
                    ~ [forbidden]

        console.log(b, basil);
        console.log("the end");
      `,
      {},
      {
        // TODO:
        // output: stripIndent`
        //   // unused imports
        //   import { b } from "./letters";
        //   import { b as basil } from "./letters";
        //
        //   console.log(b, basil);
        //   console.log("the end");
        // `
      }
    ),
    fromFixture(
      stripIndent`
        // unused types
        interface SomeInterface {}
                  ~~~~~~~~~~~~~ [forbidden]
        type SomeType = {};
             ~~~~~~~~ [forbidden]
      `,
      {},
      {
        output: stripIndent`
          // unused types
          interface SomeInterface {}
          type SomeType = {};
        `,
      }
    ),
    fromFixture(
      stripIndent`
        // unused variables
        const a = "a";
              ~ [forbidden]
        let b = "b";
            ~ [forbidden]
        var c = "c";
            ~ [forbidden]
      `,
      {},
      {
        output: stripIndent`
          // unused variables
          const a = "a";
          let b = "b";
          var c = "c";
        `,
      }
    ),
  ],
});
