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
    /**
     * This behavior is required so
     * that removeTooOldValues() can iterate over a time-sorted list.
     */
    it('re-adding should add as last element of the internal map', () => {
        const set = new index_1.ObliviousSet(100);
        set.add('a');
        set.add('b');
        set.add('c');
        // re-add
        set.add('a');
        const keys = Array.from(set.map.keys());
        assert.strictEqual(keys[2], 'a');
    });
    describe('issues', () => {
        /**
         * @link https://github.com/pubkey/oblivious-set/issues/2
         */
        describe('#2 Value update breaks removeTooOldValues', () => {
            it('should reset the TTL on re-add (check via set.has())', async () => {
                const set = new index_1.ObliviousSet(100);
                set.add('foo');
                set.add('bar');
                await async_test_util_1.default.wait(80);
                assert.strictEqual(set.has('bar'), true, 'still be there after 80');
                set.add('foo');
                await async_test_util_1.default.wait(110);
                assert.strictEqual(set.has('bar'), false, 'gone after 110 by time');
            });
            it('should reset the TTL on re-add (check by triggering removeTooOldValues())', async () => {
                const set = new index_1.ObliviousSet(100);
                set.add('foo');
                set.add('bar');
                await async_test_util_1.default.wait(80);
                assert.strictEqual(set.has('bar'), true, 'still be there after 80');
                set.add('foo');
                await async_test_util_1.default.wait(110);
                // trigger removeTooOldValues
                set.add('baz');
                await async_test_util_1.default.waitUntil(() => !set._to);
                assert.strictEqual(set.map.has('bar'), false, 'gone after 110 by removeTooOldValues');
            });
            it('should return false for values after its ttl', async () => {
                const set = new index_1.ObliviousSet(100);
                set.add('foobar');
                await async_test_util_1.default.wait(110);
                assert.strictEqual(set.has('foobar'), false);
            });
        });
    });
});
//# sourceMappingURL=unit.test.js.map