tfw_passfail = test(tfw_depth+1,tfw_show,'other',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
tfw_passfail = test(tfw_depth+1,tfw_show,'BarcodeScannerTest.js',function(tfw_depth,tfw_show) { var tfw_pass=0, tfw_fail=0, tfw_passfail;
var example = 'hello';
unitjs.string(example);
unitjs.assert(typeof example !== 'string');

if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; }); tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;
if (tfw_pass + tfw_fail > 0) return {pass:tfw_pass, fail:tfw_fail}; }); tfw_pass += tfw_passfail.pass; tfw_fail += tfw_passfail.fail;
