/*
Copyright (c) 2012, MachiApps
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
enyo.kind({
	name:"PopupCal",
	kind: enyo.VFlexBox,
	published: {
		selectedMonth: new Date().getMonth()+1,
		selectedYear: new Date().getFullYear(),
		selectedDay: new Date().getDate(),
		years: ['2010', '2011', '2012', '2013'],
		month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		dayArray: [],
		dayColorDefault: "LightSlateGray",
		dayColorSelected: "Gold",
		dayColorToday: "GoldenRod",
		dayColorOtherMonth: "Silver",
		numberColorThisMonth: "#202020",
		numberColorOtherMonth: "dimgrey",
		closeOnSelected: false,
	},
	events: {
		onSelected: "",
		onClose: ""
	},
	components:[
		{kind: "HFlexBox", components: [
			{kind: "ToolButton", icon: "images/menu-icon-back.png", onclick: "prevMonth"},
			{flex:1},
			{kind: "Picker", name: "monthName", onChange: "redraw"},
			{kind: "Picker", name: "yearName", onChange: "redraw"},
			{flex:1},
			{kind: "ToolButton", icon: "images/menu-icon-forward.png", onclick: "nextMonth"}
		]},
		{kind: "HFlexBox", components: [
			{content: "S", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
			{content: "M", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
			{content: "T", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
			{content: "W", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
			{content: "Th", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
			{content: "F", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
			{content: "S", style: "color: Crimson; font-size:14px; text-align:center; margin-top:0px;", flex:1},
		]},
		{kind: "VFlexBox", flex: 1, name: "calVBox"},
		{kind: "HFlexBox", name: "selectedBox", components:[
			{name: "selectedText", content: "Selected Day: ", style: "color: Crimson; font-size:14px; margin-top:0px;"},
			{flex:1},
			{kind: "Button", caption:"Done", style:"font-size:13px; line-height:12px; text-align:center; min-height:10px; background-color:#2071bb; color:White; margin-top:0px;", onclick: "closeWin"}
		]}
	],
	getMonthComps: function(){
		this.$.calVBox.destroyControls();
		var x1 = [];
		for (i2=0; i2<6; i2++){
			x1.push(this.getWeekComp(i2));
		}
		this.$.calVBox.createComponents(x1, {owner: this});
		this.$.calVBox.render();
	},
	getWeekComp: function(r){
		var x = [];
		for(i=0;i<7;i++){
			var d = this.dayArray[i][r];
			var m = this.selectedMonth;
			var y = this.selectedYear;
			if (r==0 && d>15){
				m--;
				if (m == -1) {
					m = 11;
					y--;
				}
			} else if (r>=4 && d<15){
				m++;
				if (m == 12) {
					m = 0;
					y++;
				}
			}
			x.push(this.getDayComp(d,m,y));
		}
		return({kind:"HFlexBox", flex:1, components:x});
	},
	getDayComp: function(d,m,yr){
		var c = this.dayColorDefault;
		var d1 = new Date().getDate();
		var m1 = new Date().getMonth() + 1;
		var y1 = new Date().getFullYear();
		if (m < this.selectedMonth || m > this.selectedMonth) {
			//Not Current Month
			c = this.dayColorOtherMonth;
		} else if (this.selectedYear == yr && this.selectedDay == d && this.selectedMonth == m && !this.closeOnSelected) {
			//Selected Day
			c = this.dayColorSelected;
		} else if (y1 == yr && d1 == d && m1 == m) {
			//Current Day
			c = this.dayColorToday;
		}
		var c2 = this.numberColorThisMonth;
		if (this.selectedMonth != m) {
			c2 = this.numberColorOtherMonth;
		}
		return({flex:1, onclick: 'calTap', style: "background-color:" + c + "; color:" + c2 + "; font-size:14px; margin:1px; padding:3px; border:1px solid #000000;", day: d, month: m, year: yr, content: d});
	},
	calTap: function(inSender, event) {
		this.selectedDay = inSender.day;
		this.updateStuff();
		this.doSelected(inSender.year, inSender.month, this.selectedDay);
		if(this.closeOnSelected){
			this.closeWin();
		} else {
			this.drawCal();
		}
	},

	rendered: function(){
		for (i = 0; i < 7; i++) {
			this.dayArray[i] = [];
		}
		if (this.closeOnSelected){
			this.$.selectedBox.setShowing(false);
		}
		this.drawCal();
		this.$.monthName.setItems(this.month);
		this.$.yearName.setItems(this.years);
		this.updateStuff();
	},
	closeWin: function(){
		this.doClose();
	},
	prevMonth: function(){
		var x1 = new Date(this.selectedYear, this.selectedMonth - 2);
		this.selectedMonth = x1.getMonth() + 1;
		this.selectedYear = x1.getFullYear();
		this.updateStuff();
		this.drawCal();
	},
	nextMonth: function(){
		var x1 = new Date(this.selectedYear, this.selectedMonth);
		this.selectedMonth = x1.getMonth() + 1;
		this.selectedYear = x1.getFullYear();
		this.updateStuff();
		this.drawCal();
	},
	updateStuff: function(){
		this.$.monthName.setValue(this.month[this.selectedMonth-1]);
		this.$.yearName.setValue(this.selectedYear);
		this.$.selectedText.setContent("Selected Day: " + this.month[this.selectedMonth-1] + " " + this.selectedDay + ", " + this.selectedYear);
	},
	redraw: function(){
		var sm = this.$.monthName.getValue();
		for (i=0;i<this.month.length;i++){
			if (sm == this.month[i]){
				this.selectedMonth = i+1;
			}
		}
		this.selectedYear = this.$.yearName.getValue();
		this.drawCal();
	},
	drawCal: function(){
		this.getDays();
		this.getMonthComps();
	},
	getDays: function(){
		var dt = new Date(this.selectedMonth + " 1, " + this.selectedYear);
		var offsetNum = dt.getDay();
		var lastDayPrevMonth = 31;
		if (this.selectedMonth == (5 || 7 || 10 || 12)){
			lastDayPrevMonth = 30;
		} else if (this.selectedMonth == 3){
			if (((this.selectedYear % 4 == 0) && (this.selectedYear % 100 != 0)) || (this.selectedYear % 400 == 0)) {
				lastDayPrevMonth = 29;
			} else {
				lastDayPrevMonth = 28;
			}
		}
		
		//PreviousMonthDays
		for (i=0;i<offsetNum;i++){
			this.dayArray[offsetNum-1-i][0] = lastDayPrevMonth-i;
		}
		
		var lastDayCurMonth = 31;
		if (this.selectedMonth == (4 || 6 || 9 || 11)){
			lastDayCurMonth = 30;
		} else if (this.selectedMonth == 2){
			if (((this.selectedYear % 4 == 0) && (this.selectedYear % 100 != 0)) || (this.selectedYear % 400 == 0)) {
				lastDayCurMonth = 29;
			} else {
				lastDayCurMonth = 28;
			}
		}
		
		var day = 1;
		for (row = 0; row < 6; row++) {
			for (col = 0; col < 7; col++) {
				if(row==0 && col==0){
					col = offsetNum;
				}
				this.dayArray[col][row] = day;
				if (day==lastDayCurMonth){
					//Next Month Start
					day = 0;
				}
				day++;
			}
		}
	}
})