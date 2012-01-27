enyo.kind({
	name: "mainApp",
	published: {		
		launchParams: null
	},
	kind: enyo.VFlexBox,
	components: [
		{kind: "RowGroup", name: "mainGroup", components: [
			{className: "enyo-row", name: "sDate", components: [
				{layoutKind: "HFlexLayout", align: "center", components: [
					{content: "Start Date", className: "enyo-label", flex: 1},
					{kind: "DatePicker", name: "newBillDate", label: "", className: "picker-hbox"},
					{kind: "Image", style: "height:32px; width: 32px; padding-right:0px; margin-top:0px; padding-left: 10px;", src: "images/calbutton.png", onclick: "openCal"}
				]}
			]},
			{className: "enyo-row", name: "eDate", components: [
				{layoutKind: "HFlexLayout", align: "center", components: [
					{content: "End Date", className: "enyo-label", flex: 1},
					{kind: "CheckBox", name: "endDateCB", onclick: "endDateClick"}
				]},
				{layoutKind: "HFlexLayout", showing: false, name: "endDatePicker", align: "center", components: [
					{flex:1},
					{kind: "DatePicker", name: "endDatePicker2", label: ""},
					{kind: "Image", style: "height:32px; width: 32px; padding-right:0px; margin-top:0px; padding-left: 10px;", src: "images/calbutton.png", onclick: "openEndCal"}
				]}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
	},
	openCal: function(inSender, inEvent){
		this.$.sDate.setStyle("background-color: LightBlue;");
		var y = this.$.eDate.createComponent({kind: "Popup", dismissWithClick: false, name: "calPopup", style: "border-width: 12px;", components:[
										{kind: "PopupCal", width: '320px', onSelected: "dateChanged", onClose: "closeStartDate", closeOnSelected: true}
									]}, {owner: this});
		y.openAtEvent(inEvent);
	},
	closeStartDate: function(){
		this.$.calPopup.destroy();
	},
	dateChanged: function(inSender,y,m,d){
		this.$.sDate.setStyle("");
		this.$.newBillDate.setValue(new Date(y,(m-1),d));
	},
	openEndCal: function(inSender, inEvent){
		this.$.eDate.setStyle("background-color: LightBlue;");
		var y = this.$.eDate.createComponent({kind: "Popup", name: "calPopupEnd", style: "border-width: 12px;", components:[
										{kind: "PopupCal", width: '320px', onSelected: "dateEndChanged", onClose: "closeEndDate", closeOnSelected: false}
									]}, {owner: this});
		y.openAtEvent(inEvent);
	},
	closeEndDate: function(){
		this.$.eDate.setStyle("");
		this.$.calPopupEnd.destroy();
	},
	dateEndChanged: function(inSender,y,m,d){
		this.$.endDatePicker2.setValue(new Date(y,(m-1),d));
	},
	endDateClick: function(inSender, inEvent){
		this.$.endDatePicker.setShowing(inSender.getChecked());
	}
});