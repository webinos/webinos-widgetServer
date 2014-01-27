(function(exports) {

    var fs = require('fs');
	var path = require('path');
	var Parser = require('node-expat').Parser;
		
    exports.listTestWidgets = function (req, res) {
		var parser = this.parser = new Parser('UTF-8');
		var list = [];
		var current = { text: "" };

		var startElement = function(name, attrs) {
			console.log('listTestWidgets: - startElement: name: ' + name);
			
			if (name === "test") {
				current.src = attrs["src"];
				current.id = attrs["id"];
				current.forAttr = attrs["for"];
			}
		};
		
		var endElement = function(name) {
			if (name === "test") {
				console.log(current.text);
				list.push(current);
				current = { text: "" };			
			}
		};
		
		var text = function(val) {
      current.text = current.text + val;
		};
		
		parser.on('startElement', startElement);
		parser.on('endElement', endElement);
		parser.on('text', text);

		try {
			var buffer = fs.readFileSync(path.join(__dirname,"../static/tests/widget_dig_sig_tests/test-suite.xml"),"UTF-8");
			console.log("listTestWidgets - about to parse: ");				
			parser.parse(buffer, {isFinal:true});
		} catch(e) {
			console.log(e);
		}
		
		res.render('widgetDigSigTests', { pageTitle: 'widget dig. sig. tests', widgets: list, baseDir: __dirname });
    };
}(module.exports));
