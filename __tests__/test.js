const exclusions=['node_modules/a1/a1.b1/a1.b1.c1', 'node_modules/a1/a1.b2', 'node_modules/a2']
describe('exclusions', ()=>{
    test('sorting', ()=>{
        expect(exclusions.sort()).toBe(exclusions)
    })
})