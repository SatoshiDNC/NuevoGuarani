/*
 * This file defines the format in which the receipt is encoded for
 * transmission from the vendor to the customer via QR code. It is
 * intentionally encoded in such a way as to convey vendor-provided data
 * (as on existing receipts) in a mostly human-readable format that can also
 * be machine interpreted.
 *
 * The data format consists of a JSON array in plaintext, with the following
 * constraints:
 *
 * o The top-level object is an array.
 *
 * o The first two elements are integers m, n such that 0 < m <= n.
 *
 *   Since the data will often exceed the capacity of a single QR code, these
 *   numbers shall be present to indicate which part of a multi-part
 *   transmission is being presented, and how many parts exist in total.
 *
 *   Example: [1,1,...] // for a small receipt that fits in one barcode
 *
 *   Example: [2,5,...] // the second of five QR codes during transmission of
 *                      // a longer receipt
 *
 * o The third element is an object containing zero or more fields.
 *
 * o Each field consists of an integer key wrapped in quotes (as required by
 *   the JSON format) and a value whose type is defined in the following
 *   table. Where the type {n,v} appears in the table, it always refers to a
 *   JSON object with key name n and value v of type string. This is
 *   intentionally the most common type of entry, which allows vendors to
 *   present names and values of data in the style of their choosing while
 *   the numeric key provides for automated decoding.
 *
 *   Example: [1,3,{...,"1":{"":"Mary's Produce"},...}]
 *   Explanation: This is a two-part receipt spread across two QR codes. This
 *   data string represents the first part and includes the vendor name, which
 *   would be printed without a label as "Mary's Produce". Automated tools
 *   would be able to recognize this as the name of the vendor because of the
 *   key of "1" (defined in the table below).
 *
 *   Example: [1,2,{...,"3":{"Date":"19/05/2023 11:36:11"},...}]
 *   Explanation: Similar to the previous example, this includes the date of
 *   the sale in the human-readable way that the vendor presents it according
 *   to their locale. Automated tools may know that this is intended to
 *   represent the date of sale because of the key of "3" (defined in the
 *   table below).
 *

Key Type  Detailed Definition
  0 {n:v} Protocol version v as an integer (wrapped in quotes).
  1 {n:v} The name of the business, store, vendor, or entity selling goods.
  2 {n:v} Street address.
  3 {n:v} Date and time of sale.
  4 {n:v} Phone number.
105 {n:v} RUC number for Paraguayan businesses.
106 {n:v} Seal number (timbrado) for Paraguayan businesses.
107 {n:v} Seal valid from date for Paraguayan businesses.
108 {n:v} Seal valid till date for Paraguayan businesses.
  5 {n:v} Vendor's receipt number.
  6 {n:v} Presence indicates that taxes are included in the item prices.
  7 {n:v} Presence indicates that taxes are not included in the item prices.
  8 {n:v} Cashier number
  9 {n:v} Cashier name
 10 {n:v} Customer name
109 {n:v} Customer RUC for Paraguayan businesses.
 11 [...] An array containing a list of key-value pairs corresponding to the
          data provided for the items purchased. The key is a (quoted) integer
          referring to a definition in this table and the value is a string
          as would be printed on the receipt in a header.
 12 [...] An array of arrays, with each sub array corresponding to one
          line-item purchased. Within the subarray, each element is a string
          corresponding to the definitions provided in type 11 above with the
          same number of elements and no gaps (empty strings are allowed).

 */

class Receipt {
	static get VENDOR() { return 1; }
	static get TELEPHONE() { return 2; }
  static get DATE_AND_TIME() { return 3; }

	// An array containing a list of key-value pairs corresponding to the
	// data provided for the items purchased. The key is a (quoted) integer
	// referring to a definition in this table and the value is a string
	// as would be printed on the receipt in a header.
  static get LIST_HEAD() { return 4; }

	// An array of arrays, with each sub array corresponding to one
	// line-item purchased. Within the subarray, each element is a string
	// corresponding to the definitions provided in type 11 above with the
	// same number of elements and no gaps (empty strings are allowed).
  static get LIST_ITEM() { return 5; }

  static get ITEM_NUM() { return 6; }
  static get ITEM_DESC() { return 7; }
  static get ITEM_QTY() { return 8; }
  static get ITEM_PRICE() { return 9; }

	static get LOC_ADDRESS() { return 10; }
	static get LOC_CITY() { return 11; }
	static get LOC_STATE() { return 12; }
	static get LOC_STATE_US() { return 12.1; }
	static get LOC_POSTAL_CODE() { return 13; }
	static get LOC_POSTAL_CODE_US() { return 13.1; }
	static get LOC_POSTAL_CODE_PY_OLD() { return 13.01; }
	static get LOC_POSTAL_CODE_PY_NEW() { return 13.02; }
	static get LOC_COUNTRY() { return 14; }
  static get VEND_TAX_ID() { return 15; }
  static get VEND_TAX_ID_PY_RUC() { return 15.01; }
  static get VEND_LIC_NUM() { return 16; }
  static get VEND_LIC_VALID_FROM() { return 17; }
  static get VEND_LIC_VALID_TILL() { return 18; }
  static get TITLE_INVOICE_DETAILS() { return 19; }
	static get INVOICE_NUM() { return 20; }
  static get TITLE_TERMS_OF_SALE() { return 21; }
  static get TAX_INCLUDED() { return 22; }
  static get TAX_NOT_INCLUDED() { return 23; }
  static get CASHREG_NUM() { return 24; }
  static get CASHIER_NAME() { return 25; }
  static get CUST_NAME() { return 26; }
  static get CUST_TAX_ID() { return 27; }
  static get CUST_TAX_ID_PY_RUC() { return 27.01; }
  static get SEP() { return 28; }

  static get ITEM_TOTAL() { return 29; }
  static get ITEM_TAX_CATEGORY() { return 30; }
  static get INV_SUBTOTAL() { return 31; }

  static get PMT_DETAILS() { return 32; }
  static get PMT_CASH() { return 33; }
  static get PMT_TOTAL() { return 34; }
  static get PMT_CHANGE_DUE() { return 35; }

  static get TAX_DETAILS() { return 36; }
  static get TAX_HEAD() { return 4.1; }
  static get TAX_ITEM() { return 5.1; }
  static get TAX_CATEGORY() { return 37; }
  static get CAT_TAXABLE_AMT() { return 38; }
  static get CAT_TAX_AMT() { return 39; }
  static get TAX_TOTAL() { return 40; }
  static get NOTE() { return 41; }

	// An empty array or an array of three elements: [integer, string,
	// integer] representing minimum widths and a separator for a two-column
  // format. If the array is empty, tabular formatting is turned off.
  static get TAB() { return 42; }


	constructor() {
		this.clear();
	}
	clear() {
		this.data = [];
	}
	has(key) {
		if (key === undefined) console.log('undefined key for:', name, value);
		for (var o of this.data) {
			if (Object.keys(o).includes(key.toString())) return true;
		}
	}
	append(key, name, value) {
		if (key === undefined) console.log('undefined key for:', name, value);
		var temp = {}
		temp[key.toString()] = [name.toString(), value.toString()];
		this.data.push(temp);
	}
	appendTabFmt(key, w1, sep, w2) {
		if (key === undefined) console.log('undefined key for tab format.');
		var temp = {}
		if (w1 || sep || w2) {
			temp[key.toString()] = [w1, sep, w2];
		} else {
			temp[key.toString()] = [];
		}
		this.data.push(temp);
	}
	appendListHead(key, values) {
		if (key === undefined) console.log('undefined key for:', values);
		var list = [];
		for (var f of values) {
			var temp = {}
			temp[f[0].toString()] = [f[1].toString(), f[2]];
			list.push(temp);
		}
		var temp = {}
		temp[key.toString()] = list;
		this.data.push(temp);
	}
	appendListItem(key, values) {
		if (key === undefined) console.log('undefined key for:', values);
		var temp = {}
		temp[key.toString()] = values;
		this.data.push(temp);
	}
	addVendorHeaders() {
		this.append(Receipt.VENDOR, "", "**BIO-GRANJA EL DORADO E.I.R.L.    **");
		this.append(Receipt.LOC_ADDRESS, "", "M. Auxiliadora 9002");
		this.append(Receipt.TELEPHONE, "", "+595 986 124 208");
		this.append(Receipt.VEND_TAX_ID_PY_RUC, "R.U.C.", "80064237-6");
		this.append(Receipt.VEND_LIC_NUM, "Timbrado Na", "15856902");
		this.append(Receipt.VEND_LIC_VALID_FROM, "Valido Desde", "1/09/2022");
		this.append(Receipt.VEND_LIC_VALID_TILL, "Valido Hasta", "30/09/2023");
		this.append(Receipt.TITLE_INVOICE_DETAILS, "", "**FACTURA CONTADO**");
		this.append(Receipt.INVOICE_NUM, "Factura Na", "001-003-0022282");
		this.append(Receipt.TITLE_TERMS_OF_SALE, "", "Condición de Venta Contado");
		this.append(Receipt.TAX_INCLUDED, "", "I.V.A. Incluido");
		this.appendTabFmt(Receipt.TAB+0.1, 7, ": ", 0);
		this.append(Receipt.CASHREG_NUM, "Caja Na", "1");
		this.append(Receipt.DATE_AND_TIME, "Fecha", "19/05/2023 11:36:11");
		this.append(Receipt.CASHIER_NAME, "Cajero", "Caja Perla");
		this.append(Receipt.CUST_NAME, "Cliente", "CLIENTE SIN NOMBRE");
		this.append(Receipt.CUST_TAX_ID_PY_RUC, "R.U.C.", "00000000-0");
		this.append(Receipt.SEP+0.1, "", "-");
		this.appendListHead(Receipt.LIST_HEAD, [
			[Receipt.ITEM_NUM,   "Articulo  ",   10],
			[Receipt.ITEM_DESC,  "Descripción", 0],
			[Receipt.ITEM_QTY,   "Cantidad",    0],
			[Receipt.ITEM_PRICE, "Precio",      9],
			[Receipt.ITEM_TOTAL, "Total",      17],
			[Receipt.ITEM_TAX_CATEGORY, " TI",  3],
		]);
		this.append(Receipt.SEP+0.2, "", "-");
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,914", "ALCAPARRAS G&G 90GR", "1,000", "16.200", "16.200", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,465", "PURE DE TOMATE LA HUERTA, 210", "1,000", "4.000", "4.000", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,465", "PURE DE TOMATE LA HUERTA, 210", "1,000", "4.000", "4.000", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"5,520", "BICARBONATO DE SODIO X KG", "0,190", "22.000", "4.180", "5%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"5,355", "COCO RALLADO COPASLA, X KG", "0,130", "44.300", "5.538", "10%"]);

		this.appendListItem(Receipt.LIST_ITEM, [
			"5,476", "PAN BIMBO SANDWICH BLANCO, 88", "1,000", "15.700", "15.700", "5%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,959", "ERDNUSS CREME G+G CROCANTE, 3", "1,000", "28.900", "28.900", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"194", "FIDEOS ANITA SPAGHETTI NIDO,", "1,000", "5.400", "5.400", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"775", "AJI MOLIDO PRIMICIA 25G", "1,000", "3.300", "3.300", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"4,216", "YOGHURT SUPER YO VAINILLA, 35", "1,000", "4.200", "4.200", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"490", "MANTECA TREBOL EN PAN, 200G", "1,000", "13.900", "13.900", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,914", "ALCAPARRAS G&G 90GR", "1,000", "16.200", "16.200", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,647", "PIMIENTA G+G COLORIDA 40GR co", "1,000", "26.700", "26.700", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"221", "DETERGENTE ZITRON VERDE, 500C", "1,000", "6.200", "6.200", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"6,986", "AVENA ARROLLADA BROTERRA, 350", "1,000", "11.500", "11.500", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"10,483", "HARINA DE TRIGO, PARAVIDA, 1K", "1,000", "17.000", "17.000", "5%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"7,799", "Cubierto Inox mango Agrilico", "1,000", "16.800", "16.800", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"4,777", "TABLA PICA CARNE PLASTICA, 29", "1,000", "29.700", "29.700", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"4,087", "ESPATULA MADERA", "1,000", "59.800", "10.000", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,681", "QUESO TCHE MOZZARELLA TIPO IT", "0,850", "50.531", "50.531", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"384", "LEVADURA COPALSA SECA EN SOBR", "1,000", "7.200", "7.200", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"278", "GALLET. MONDELEZ CEREALITAS C", "1,000", "3.700", "3.700", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"1,607", "CARICIA UVA, 25GR", "1,000", "1.500", "1.500", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,648", "PURE DE MANZANA SPREEWALDHOF", "1,000", "27.900", "27.900", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,916", "MANI SALADO TOSTADO SESAMI, 2", "1,000", "14.900", "14.900", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"8,379", "SALSA FRUTIKA FILETTO, 300GR", "1,000", "6.700", "6.700", "10%"]);
		this.appendListItem(Receipt.LIST_ITEM, [
			"9,992", "BOLSA PARA EMPAQUE X UN", "2,000", "500", "1.000", "10%"]);

		this.append(Receipt.SEP+0.3, "", "-");
		this.appendTabFmt(Receipt.TAB+0.2, 17, "---->", 17);
		this.append(Receipt.INV_SUBTOTAL, "Importe Total", "33.918");
		this.appendTabFmt(Receipt.TAB+0.3);
		this.append(Receipt.SEP+0.4, "", "-");
		this.append(Receipt.SEP+0.5, "", "");

		this.appendTabFmt(Receipt.TAB+0.4, 0, "", 0);
		this.append(Receipt.PMT_DETAILS, "", "Detalle de Pagos:");
		this.append(Receipt.SEP+0.6, "", "-");
		this.appendTabFmt(Receipt.TAB+0.5, 14, "", 22);
		this.append(Receipt.PMT_CASH, "Efectivo:", "50.000");
		this.appendTabFmt(Receipt.TAB+0.6, 14, "---->", 17);
		this.append(Receipt.PMT_TOTAL, "Total Pagos", "50.000");
		this.append(Receipt.PMT_CHANGE_DUE, "Su Vuelto", "16.082");
		this.appendTabFmt(Receipt.TAB+0.7);
		this.append(Receipt.SEP+0.7, "", "");

		this.appendListHead(Receipt.TAX_HEAD, [
			[Receipt.TAX_CATEGORY,    "SUB TOTALES", 14],
			[Receipt.CAT_TAXABLE_AMT, "LIQUIDACION",  0],
			[Receipt.CAT_TAX_AMT,     "IVA",         13],
		]);
		this.append(Receipt.SEP+0.8, "", "-");
		this.appendListItem(Receipt.TAX_ITEM, [
			"Exento", "", ""]);
		this.appendListItem(Receipt.TAX_ITEM, [
			"Gravado 10%", "29.737", "2.703"]);
		this.appendListItem(Receipt.TAX_ITEM, [
			"Gravado  5%", "4.180", "199"]);
		this.appendListItem(Receipt.TAX_ITEM, [
			"Total:", "", "2.902"]);
		//this.append(Receipt.TAX_TOTAL, "Total", "2.902");
		this.append(Receipt.SEP+0.9, "", "");

		this.append(Receipt.NOTE+0.1, "", "******Original: Cliente******");
		this.append(Receipt.NOTE+0.2, "", "******Duplicado: Archivo Tributario******");
		this.append(Receipt.NOTE+0.3, "", "******Gracias Por su Preferencia******");
	}
	toParts() {
		const parts = []; var part = [];
		for (var o of this.data) {
			var resort = JSON.stringify(part);
			part.push(o);
			if (JSON.stringify(part).length > 500 && resort != '[]') {
				parts.push(resort);
				part = [];
				part.push(o);
			}
		}
		parts.push(JSON.stringify(part));
		for (i=1; i<=parts.length; i++) {
			const PAD_TO = 512;
			var temp = '['+i+','+parts.length+','+parts[i-1].substring(1);
			const pads = [' ', '\n', '\t', '\r'];
			var n = PAD_TO - temp.length;
			if (n > 0) {
				var j, k = Math.floor(n / 7);
				temp = '[';
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				temp += ''+i;
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				temp += ',';
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				temp += ''+parts.length;
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				temp += ',';
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				temp += parts[i-1].substring(1, parts[i-1].length-1);
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				temp += ']';
				for (j=0; j<k; j++) { temp += pads[Math.floor(Math.random()*pads.length)]; n-=1; }
				while (n > 0) {
					temp += pads[Math.floor(Math.random()*pads.length)];
					n -= 1;
				}
			}
			parts[i-1] = temp.padEnd(PAD_TO);
		}
		return parts;
	}
	fromParts(parts) {
		var rec = [];
		for (var i=0; i<parts.length; i++) {
			if (!(rec[i] = tryParseJSONObject(parts[i]))) return false;
		}
		var obj = [];
		for (var i=0; i<rec.length; i++) {
			for (var j=2; j<rec[i].length; j++) {
				obj.push(rec[i][j]);
			}
		}
		this.data = obj;
		return obj;
	}
}


