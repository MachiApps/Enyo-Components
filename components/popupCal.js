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
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
		{kind: "VFlexBox", name: "calView", components: [
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
			{kind:"Control", flex: 1, content: "<div style='position: relative;'><canvas id='myCanvas' width='330px' height='275.7px' style='position: absolute; left: 0; top: 0; z-index: 0;'></canvas></div>", height:'275px', onclick: "calTap"},
			{kind: "HFlexBox", name: "selectedBox", components:[
				{name: "selectedText", content: "Selected Day: ", style: "color: Crimson; font-size:14px; margin-top:-7px;"},
				{flex:1},
				{kind: "Button", caption:"Done", style:"font-size:13px; line-height:12px; text-align:center; min-height:10px; background-color:#2071bb; color:White; margin-top:-10px;", onclick: "closeWin"}
			]}
		]}
	],
	
	

	rendered: function(){
		for (i = 0; i < 7; i++) {
			this.dayArray[i] = [];
		}
		if (this.closeOnSelected){
			this.$.selectedBox.setShowing(false);
		}
		var x_tot = 310;
		var y_tot = x_tot*6/7;
		this.drawCal();
		this.$.monthName.setItems(this.months);
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
		this.$.monthName.setValue(this.months[this.selectedMonth-1]);
		this.$.yearName.setValue(this.selectedYear);
		this.$.selectedText.setContent("Selected Day: " + this.months[this.selectedMonth-1] + " " + this.selectedDay + ", " + this.selectedYear);
	},
	redraw: function(){
		var sm = this.$.monthName.getValue();
		for (i=0;i<this.months.length;i++){
			if (sm == this.months[i]){
				this.selectedMonth = i+1;
			}
		}
		this.selectedYear = this.$.yearName.getValue();
		this.drawCal();
	},
	drawCal: function(){
		this.getDays();
		this.drawStuff();
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
	},
	drawDayRect: function(x, y, d, m, yr) {
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext("2d");
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
		//Shadow
		ctx.fillStyle = 'Black';
		ctx.fillRect(x+1, y+1, 43, 40);
		//Day Rectangle
		ctx.fillStyle = c;
		ctx.fillRect(x, y, 43, 40);
	},
	drawNum: function(dayNumber, color, x, y) {
		n_size = 15;
		var off_s = 1;
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "silver";
		ctx.font = "bold " + n_size + "px Calibri";
		ctx.fillText(dayNumber, x + 3+off_s, y + 16 + off_s);
		ctx.fillStyle = color;
		ctx.font = "bold " + n_size + "px Calibri";
		ctx.fillText(dayNumber, x + 3, y + 16);
	},
	drawStuff: function() {
		for (i = 0; i < 6; i++) {
			for (j1 = 0; j1 < 7; j1++) {
				var x_off = (46) * j1;
				var y_off = 5 + (42.5) * i;
				var d = this.dayArray[j1][i];
				var m = this.selectedMonth;
				var y = this.selectedYear;
				if (i == 0 && d > 15) {
				//Previous Month
					m--;
					if (m == -1) {
						m = 11;
						y--;
					}
				} else if (i > 3 && d < 15) {
				//Next Month
					m++;
					if (m == 12) {
						m = 0;
						y++;
					}
				}
				this.drawDayRect(x_off, y_off, d, m, y);
				var c = this.numberColorThisMonth;
				if (this.selectedMonth != m) {
					c = this.numberColorOtherMonth;
				}
				this.drawNum(d, c, x_off, y_off);
			}
		}
		
	},
	calTap: function(inSender, event) {
		var x = event.offsetX;
		var y = event.offsetY;
		var x1 = Math.floor(((x) / (46)));
		var y1 = Math.floor((y - 5) / (42.5));
		var z = this.dayArray[x1][y1];
		if (y1 == 0 && this.dayArray[x1][y1] > 10) {
			this.selectedMonth--;
			if (this.selectedMonth == 0) {
				this.selectedMonth = 12;
				this.selectedYear--;
			}
		} else if (y1 > 3 && this.dayArray[x1][y1] < 15) {
			this.selectedMonth++;
			if (this.selectedMonth == 13) {
				this.selectedMonth = 1;
				this.selectedYear++;
			}
		}
		if (!isNaN(z)) {
			this.selectedDay = z;
			this.updateStuff();
			this.drawCal();
			this.doSelected(this.selectedYear, this.selectedMonth, this.selectedDay);
			if(this.closeOnSelected){
				this.closeWin();
			}
		}
	}
})