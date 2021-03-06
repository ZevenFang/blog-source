Validator = {
	Require : /.+/,
	Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	Phone : /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
	Mobile : /^(((\(\d{2,3}\))|(\d{3}\-))?13\d{9})|(((\(\d{2,3}\))|(\d{3}\-))?15\d{9})|(((\(\d{2,3}\))|(\d{3}\-))?18\d{9})$/,
	PhoneM : /^(((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?)|((((\(\d{2,3}\))|(\d{3}\-))?13\d{9})|(((\(\d{2,3}\))|(\d{3}\-))?15\d{9}))|(((\(\d{2,3}\))|(\d{3}\-))?18\d{9})$/,
	Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	Html: /^<(.*)>.*<\/\1>|<(.*)[\/]?>/,
	IdCard : "this.IsIdCard(value)",
	DaoyouZH:/^[D|d]{0,1}[-]?(\d){1,5}([-]?(\d){1,7})$/g,
	Orid: "this.IsOrid(value)",
	Zfid: "this.IsZfid(value)",
	Currency : /^\d+(\.\d+)?$/,
	Amount : /^\d+(\.\d{1,2})?$/,
	Number : /^\d+$/,
	NumberM : /^[0-9]*[1-9][0-9]*$/,
	Shengao : /^[1-2]{1}[0-9]{2}$/,
	Code : /^[0-9]\w{3}$/,
	Zip : /^[0-9]\d{5}$/,
	QQ : /^[1-9]\d{4,12}$/,
	Integer : /^[-\+]?\d+$/,
	Double : /^[-\+]?\d+(\.\d+)?$/,
	English : /^[A-Za-z]+$/,
	EnglishNumber : /^[A-Za-z0-9]+$/,
	Chinese :  /^[\u0391-\uFFE5]+$/,
	Lname:/^(([\u0391-\uFFE5]+)|([A-Za-z]+\s*[A-Za-z]+))$/,
	Username : /^([A-Za-z]{1}?[A-Za-z0-9_]+)$/i,
	Password : /^[A-Za-z0-9]\w{7,14}$/i,
	PasswordSys : /^[A-Za-z0-9]\w{5,14}$/i,
	UnSafe : /^(([A-Za-z0-9]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	IsSafe : function(str){return !this.UnSafe.test(str);},
	SafeString : "this.IsSafe(value)",
	Filter : "this.DoFilter(value, getAttribute('accept'))",
	Limit : "this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
	LimitB : "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
	Date : "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
	Repeat : "value == document.getElementsByName(getAttribute('to'))[0].value",
	Range : "getAttribute('min') < (value|0) && (value|0) < getAttribute('max')",
	Compare : "this.compare(value,getAttribute('operator'),getAttribute('to'))",
	Between : "this.between(value,getAttribute('operator'),getAttribute('min'),  getAttribute('max'))",
	Custom : "this.Exec(value, getAttribute('regexp'))",
	Group : "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
	ErrorItem : [document.forms[0]],
	ErrorMessage : [errTitle+"\n \t\t\t\t"],
	Validate : function(theForm, mode,anoId){
		var obj = theForm || event.srcElement;
		var mode = mode || 1;
		var count = obj.elements.length;
		this.ErrorMessage.length = 1;
		this.ErrorItem.length = 1;
		this.ErrorItem[0] = obj;
		//usname*?!guest|admin|ectrip|manager|bbs|trip|blog|ticket|hotel|destination|shop|business|travel|line|jingqu|help|my|pay|oa
		for(var i=0;i<count;i++){
			with(obj.elements[i]){
				var _dataType = getAttribute("dataType");
				if(typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined")  continue;
				this.ClearState(obj.elements[i]);
				if(getAttribute("require") == "false" && value == "") continue;
				switch(_dataType){
					case "IdCard" :
					case "Orid" :
					case "Date" :
					case "Repeat" :
					case "Range" :
					case "Compare" :
					case "Between" :
					case "Custom" :
					case "Group" : 
					case "Limit" :
					case "LimitB" :
					case "SafeString" :
					case "Filter" :
						if(!eval(this[_dataType]))	{
							this.AddError(i, getAttribute("msg"),mode);
						}
						break;
					default :
						if((!this[_dataType].test(value))||(_dataType=="Require"&&value=="00")){
							//value=="00" 为了省份判断
							if ((_dataType=="DaoyouZH")&&(this[_dataType].test(value).toString()=="false")){
							this.AddError(i, getAttribute("msg"),mode);
							}else if (_dataType!="DaoyouZH"){
							this.AddError(i, getAttribute("msg"),mode);
							}
						}
						break;
				}
			}
		}

		if(this.ErrorMessage.length > 1){
			
			var errCount = this.ErrorItem.length;
			
			switch(mode){
			case 3 :
				for(var i=1;i<errCount;i++){
					var thisErrorItem=jQuery(this.ErrorItem[i]);
					var textareaYes="span";
					
					if(thisErrorItem.attr("type")=="text"||thisErrorItem.attr("type")=="password"||thisErrorItem[0].nodeName=="TEXTAREA"){
						thisErrorItem.removeClass("input_ok");
						thisErrorItem.addClass("input_err");
						if(thisErrorItem[0].nodeName=="TEXTAREA") textareaYes="div";
					}
					
					try{					
						var thisErrorItemN=thisErrorItem.next();
						var thisErrorText=this.ErrorMessage[i].replace(/\d+:/,"");
						
						if(thisErrorItemN.length==0){
							thisErrorItem.after("<"+textareaYes+" class='red __ErrorMessagePanel input_err_info'>"+thisErrorText+"</"+textareaYes+">");	
						}else{
							if(thisErrorItemN.text()!="*"){
								thisErrorItem.siblings(":last").after("<"+textareaYes+" class='red __ErrorMessagePanel input_err_info'>"+thisErrorText+"</"+textareaYes+">");
							}else{
								thisErrorItemN.addClass("red __ErrorMessagePanel input_err_info");
								thisErrorItemN.attr("delete","false");
								thisErrorItemN.html(thisErrorText);
							}
						}	
					}
					catch(e){alert(this.ErrorMessage.join("\n"));}
				}
				try{this.ErrorItem[1].focus();}catch(e){}
				break;
			case 4 :
				var errid = jQuery("#main_errors");
				
				if ( typeof anoId != "undefined" ){
				if ( anoId!= "" )
				errid=jQuery("#"+anoId);
				}
				var errinfoArr=new Array();
				
				
				for(var i=1;i<errCount;i++){
					try{
						var thisErrorItem=jQuery(this.ErrorItem[i]);
						if(thisErrorItem.attr("type")=="text"||thisErrorItem.attr("type")=="password"||thisErrorItem[0].nodeName=="TEXTAREA"){
							thisErrorItem.removeClass("input_ok");
							thisErrorItem.addClass("input_err");
						}
						if(thisErrorItem[0].nodeName=="SELECT"){
							var thisErrorItemN=thisErrorItem.next();
							
							if(thisErrorItemN.length==0){
								thisErrorItem.after("<span class='red __ErrorMessagePanel'>*</span>");	
							}else{
								if(thisErrorItemN.text()!="*"){
								thisErrorItem.siblings(":last").after("<span class='red __ErrorMessagePanel'>*</span>");
								}else{
								thisErrorItemN.addClass("red __ErrorMessagePanel");
								thisErrorItemN.attr("delete","false");
								}
							}
						}					
						
						errinfoArr.push("<li>"+this.ErrorMessage[i].replace(/\d+:/,"")+"</li>");
					}
					catch(e){
						errinfoArr.push("<li>"+this.ErrorMessage[i].replace(/\d+:/,"")+"</li>");
					}
				}
				
				if (i>1){
				try{
					
					jQuery(".main_errors[id!='"+errid.attr('id')+"']").hide();
					if (errid.css("display")!="block") errid.fadeIn();
					//errid.slideDown("fast");
					
					
					if ( typeof anoId != "undefined" ){
					if ( anoId!= "" )
					jQuery("#main_errors").hide();
					}
					errid.html("<div class=\"main_errors_title\">"+errTitle+"</div><ul><li style=\"height:1px; display:none; list-style:none;overflow:hidden; border:0px; padding:0px; margin:0px; margin-top:-2px;\"></li>"+errinfoArr.join('').toString()+"</ul>");
					top.window.location="#main_errors";
				}
					catch(e){
						alert(this.ErrorMessage.join("\n"));
					}//创建错误，弹出显示
				}
				try{this.ErrorItem[1].focus();}catch(e){}
				break;
			default :
				for(var i=1;i<errCount;i++){
					var thisErrorItem=jQuery(this.ErrorItem[i]);
					if(thisErrorItem.attr("type")=="text"||thisErrorItem.attr("type")=="password"||thisErrorItem[0].nodeName=="TEXTAREA"){
						thisErrorItem.removeClass("input_ok");
						thisErrorItem.addClass("input_err");
					}
					if(thisErrorItem[0].nodeName=="SELECT"){
						var thisErrorItemN=thisErrorItem.next();
						if(thisErrorItemN.length==0){
							thisErrorItem.after("<span class='red __ErrorMessagePanel'>*</span>");	
						}else{
							if(thisErrorItemN.text()!="*"){
							thisErrorItem.siblings(":last").after("<span class='red __ErrorMessagePanel'>*</span>");
							}else{
							thisErrorItemN.addClass("red __ErrorMessagePanel");
							thisErrorItemN.attr("delete","false");
							}
						}
					}
				}
				
				if(typeof systemUI!= "undefined") {
					var _this = this;
					var errStrArr = new Array();
						errStrArr = this.ErrorMessage.slice(1);
						errorMsg(errStrArr, 0, function(){
							try{
								_this.ErrorItem[1].select();
							}catch(e){}
						});
				} else {	
					alert(this.ErrorMessage.join("\n"));
					try{this.ErrorItem[1].select();  }catch(e){}
				}
				break;
			}
			return false;
		}
		if(mode==4){
			//正确直接隐藏错误信息 xyb 2007-07-26
			var errid = document.getElementById("main_errors");
			if ( typeof anoId != "undefined" ){
				if ( anoId!= "" )
				errid=document.getElementById(anoId);
			}
			if(typeof jQuery!= "undefined"){
				jQuery(".main_errors").hide();
				jQuery("#main_errors").hide();
			}else{
				errid.style.display="none";
			}
			if ( typeof anoId != "undefined" ){
				if ( anoId!= "" )
				document.getElementById("main_errors").style.display="none";
			}
			//正确直接隐藏错误信息 xyb 2007-07-26
		}
		return true;
	},
	limit : function(len,min, max){
		min = min || 0;
		max = max || Number.MAX_VALUE;
		return min <= len && len <= max;
	},
	LenB : function(str){
		return str.replace(/[^\x00-\xff]/g,"*").replace(/\s/g,"").replace(/\n/m,"").length;
	},
	ClearState : function(elem){
		with(jQuery(elem)){
			if(attr("type")=="text"||attr("type")=="password"||jQuery(elem)[0].nodeName=="TEXTAREA"){
				addClass("input_ok");
				removeClass("input_err");
			}
			var par=parent();
			par.find(".__ErrorMessagePanel[delete!='false']").remove();
			var deleteSpan=par.find(".__ErrorMessagePanel[delete='false']");
			
			deleteSpan.text("*");
			deleteSpan.removeClass("__ErrorMessagePanel");
			deleteSpan.removeClass("input_err_info");
		}
	},
	AddError : function(index, str,mode){
		this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
		if (mode==3||mode==4 || typeof systemUI!= "undefined")
		this.ErrorMessage[this.ErrorMessage.length] = str;
		else
		this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + "、" + str;
	},
	Exec : function(op, reg){
		return new RegExp(reg,"g").test(op);
	},
	compare : function(op1,operator,op2){
		switch (operator) {
			case "NotEqual":
				return (op1 != op2);
			case "GreaterThan":
				return (parseFloat(op1) > parseFloat(op2));
			case "GreaterThanEqual":
				return (parseFloat(op1) >= parseFloat(op2));
			case "LessThan":
				return (parseFloat(op1) < parseFloat(op2));
			case "LessThanEqual":
				return (parseFloat(op1) <= parseFloat(op2));
			default:
				return (op1 == op2);            
		}
	},
	between: function(nameValue,operator, min, max){
		if(nameValue!=""&&nameValue!=null&&this.Amount.test(nameValue)){
			switch (operator) {
				case "GreaterThenLess":
					return (parseFloat(max)>=parseFloat(nameValue)&&parseFloat(nameValue) > parseFloat(min));    
				case "GreaterLessThen":
					return (parseFloat(max)>parseFloat(nameValue)&&parseFloat(nameValue) >= parseFloat(min));    
				case "GreaterThenLessThen":
					return (parseFloat(max)>=parseFloat(nameValue)&&parseFloat(nameValue) >= parseFloat(min));    
				default:
					return (parseFloat(max)>parseFloat(nameValue)&&parseFloat(nameValue) > parseFloat(min));       
			}
		}else{
			return false;
		}
	},
	MustChecked : function(name, min, max){
		var groups = document.getElementsByName(name);
		var hasChecked = 0;
		min = min || 1;
		max = max || groups.length;
		for(var i=groups.length-1;i>=0;i--)
			if(groups[i].checked) hasChecked++;
			
		return min <= hasChecked && hasChecked <= max;
	},
	DoFilter : function(input, filter){
        return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, filter.split(/\s*-\s*/).join("|")), "gi").test(input);
	},
	IsIdCard : function(number){
		var date, Ai;
		var verify = "10x98765432";
		var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var area = ['','','','','','','','','','','','北京','天津','河北','山西','内蒙古','','','','','','辽宁','吉林','黑龙江','','','','','','','','上海','江苏','浙江','安微','福建','江西','山东','','','','河南','湖北','湖南','广东','广西','海南','','','','重庆','四川','贵州','云南','西藏','','','','','','','陕西','甘肃','青海','宁夏','新疆','','','','','','台湾','','','','','','','','','','香港','澳门','','','','','','','','','国外'];
		var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i);
		if(re == null) return false;
		if(re[1] >= area.length || area[re[1]] == "") return false;
		if(re[2].length == 12){
			Ai = number.substr(0, 17);
			date = [re[9], re[10], re[11]].join("-");
		}
		else{
			Ai = number.substr(0, 6) + "19" + number.substr(6);
			date = ["19" + re[4], re[5], re[6]].join("-");
		}
		if(!this.IsDate(date, "ymd")) return false;
		var sum = 0;
		for(var i = 0;i<=16;i++){
			sum += Ai.charAt(i) * Wi[i];
		}
		Ai +=  verify.charAt(sum%11);
		return (number.length ==15 || number.length == 18 && number == Ai);
	},
	IsDate : function(op,daymin,formatString){
		formatString = formatString || "ymd";
		var m, year, month, day;
		switch(formatString){
			case "md" ://适合没有年份的判断
				m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})$"));
				if(m == null ) return false;
				day = m[3];
				month = m[1]*1;
				var now = new Date();
				year =now.getYear().toString();
				break;
			case "ymd" :
				m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
				if(m == null ) return false;
				day = m[6];
				month = m[5]*1;
				year =  (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
				break;
			case "dmy" :
				m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
				if(m == null ) return false;
				day = m[1];
				month = m[3]*1;
				year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
				break;
			default :
				m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
				if(m == null ) return false;
				day = m[6];
				month = m[5]*1;
				year =  (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
				break;
		}
		if(!parseInt(month)) return false;
		month = month==0 ?12:month;
		var date = new Date(year, month-1, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == (date.getMonth()+1) && day == date.getDate());
		function GetFullYear(y){return ((y<30 ? "20" : "19") + y)|0;}
	}
}