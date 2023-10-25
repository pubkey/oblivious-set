"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_test_util_1 = __importDefault(require("async-test-util"));
const assert = __importStar(require("assert"));
const index_1 = require("../src/index");
describe('unit.test.js', () => {
    it('create, add, has, get, clear', () => {
        const set = new index_1.ObliviousSet(100);
        set.add('foobar');
        const has = set.has('foobar');
        assert.ok(has);
        set.clear();
        const hasAfter = set.has('foobar');
        assert.strictEqual(false, hasAfter);
    });
    it('.removeTooOldValues() should clear the old values when a new one is given', async () => {
        const set = new index_1.ObliviousSet(100);
        set.add('foobar');
        assert.ok(set.has('foobar'));
        await async_test_util_1.default.wait(200);
        set.add('foobar2');
        await async_test_util_1.default.wait(100);
        const has = set.has('foobar');
        assert.strictEqual(false, has);
    });
    it('.removeTooOldValues() should NOT clear to young values when a new one is given', async () => {
        const set = new index_1.ObliviousSet(500);
        set.add('foobar');
        assert.ok(set.has('foobar'));
        await async_test_util_1.default.wait(50);
        set.add('foobar2');
        assert.ok(set.has('foobar'));
    });
    it('should clear the value after its ttl', async () => {
        const set = new index_1.ObliviousSet(100);
        set.add('foobar');
        await async_test_util_1.default.wait(200);
        set.add('foobar2');
        await async_test_util_1.default.wait(100);
        const has = set.has('foobar');
        assert.strictEqual(false, has);
    });
});
//# sourceMappingURL=unit.test.js.map