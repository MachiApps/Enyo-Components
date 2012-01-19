enyo.kind({
	name: "mainApp",
	published: {		
		launchParams: null
	},
	kind: enyo.VFlexBox,
	components: [
		{kind: "Scrim", layoutKind: "VFlexLayout", align: "center", pack: "center", components: [
			{kind: "SpinnerLarge", name: "mainSpin"},
			{content: "Loading...", name: "loadInfo"}
		]},
		{kind: "Popup", name: "calPopup", style: "border-width: 12px;", components:[
			{kind: "PopupCal", width: '320px', onSelected: "dateChanged", closeOnSelected: false}
		]},
		{kind: "RowGroup", name: "xferMon", components: [
			{layoutKind: "HFlexLayout", align: "center", components: [
				{content: "Date", className: "enyo-label", flex: 1},
				{kind: "DatePicker", label:"", name: "addTransDate"},
				{kind: "Button", caption:"Show Calendar", style:"font-size:13px; line-height:12px; text-align:center; min-height:10px; background-color:#2071bb; color:White; margin-top:3px;", onclick: "openCal"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		var db = openDatabase("hello", "1.0");
		this.showScrim(true);
		db.transaction(enyo.bind(this, function (transaction) {
			this.showScrim(false);
		}));
	},
	showScrim: function(inShowing) {
		this.$.scrim.setShowing(inShowing);
		this.$.mainSpin.setShowing(inShowing);
	},
	openCal: function(inSender, inEvent){
		this.$.calPopup.openAtEvent(inEvent);
	},
	dateChanged: function(inSender,y,m,d){
		console.log(y + " " + (m-1) + " " + d);
		this.$.addTransDate.setValue(new Date(y,(m-1),d));
	}
});