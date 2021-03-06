import {DataFactory} from "rdf-data-factory";
import "jest-rdf";
import {EntryHandlerArrayValue} from "../../lib/entryhandler/EntryHandlerArrayValue";
import {Util} from "../../lib/Util";
import {ParsingContextMocked} from "../../mocks/ParsingContextMocked";

const DF = new DataFactory();

describe('EntryHandlerArrayValue', () => {
  let handler;

  beforeEach(() => {
    handler = new EntryHandlerArrayValue();
  });

  describe('isPropertyHandler', () => {
    it('should return false', async () => {
      expect(handler.isPropertyHandler()).toBe(false);
    });
  });

  describe('should handle', () => {
    let parsingContext;
    let util;

    beforeEach(() => {
      parsingContext = new ParsingContextMocked({ parser: null });
      util = new Util({ parsingContext });
    });

    it('a valid key stack, and handle the list element', async () => {
      jest.spyOn(handler, <any> 'handleListElement');
      await handler.handle(parsingContext, util, 0, [ undefined, 'parentKey', '@list', 0 ], "someValue", 3);
      expect((<any> handler).handleListElement).toHaveBeenCalledTimes(1);
      expect(parsingContext.emittedQuads).toBeRdfIsomorphic([
        DF.quad(DF.blankNode(), DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first'),
          DF.literal('someValue')),
      ]);
    });

    it('an invalid key stack with an object parent key, and not handle the list element', async () => {
      jest.spyOn(handler, <any> 'handleListElement');
      await handler.handle(parsingContext, util, 0, [ undefined, {}, '@list', 0 ], "someValue", 3);
      expect((<any> handler).handleListElement).not.toHaveBeenCalled();
    });

    it('an invalid key stack without parent key, and not handle the list element', async () => {
      jest.spyOn(handler, <any> 'handleListElement');
      await handler.handle(parsingContext, util, 0, [ undefined, '@list', 0 ], "someValue", 2);
      expect((<any> handler).handleListElement).not.toHaveBeenCalled();
    });
  });
});
