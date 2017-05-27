var calender = new controller();
calender.init();




function controller(target){

    var that =this;
    var m_oMonth = new Date();
    m_oMonth.setDate(1);

    this.init = function(){
      that.renderCalendar();
      that.initEvent();
      that.clickDate();
      taht.clickFood();
    }


   this.renderCalendar = function(){

     console.log("dd");
     var arrTable =[];

    arrTable.push('<table class="table table-bordered">');
    arrTable.push('<thead><tr>'); //월화수목금토일

    var arrWeek = "일월화수목금토".split("");

    for(var i=0, len=arrWeek.length; i<len; i++) {
      var sClass = '';
      sClass += i % 7 == 0 ? 'sun' : '';
      sClass += i % 7 == 6 ? 'sat' : '';
      arrTable.push('<td class="'+sClass+'">' + arrWeek[i] + '</td>');
    }
    arrTable.push('</tr></thead>');

    arrTable.push('<tbody>');  //일을 표기하는 표

    var oStartDt = new Date(m_oMonth.getTime());
    // 1일에서 1일의 요일을 빼면 그 주 첫번째 날이 나온다.
    oStartDt.setDate(oStartDt.getDate() - oStartDt.getDay());

    for(var i=0; i<100; i++) {
      if(i % 7 == 0) {
        arrTable.push('<tr>');
      }

      var sClass = 'date-cell ';

      sClass += m_oMonth.getMonth() != oStartDt.getMonth() ? 'not-this-month ' : '';
      sClass += i % 7 == 0 ? 'sun' : '';
      sClass += i % 7 == 6 ? 'sat' : '';



      var st_date = new Date().toISOString().substr(0, 10).replace('T', ' ');
      var r_date =st_date.split('-');
    //  console.log(r_date[1]);
      if(r_date[2].substr(0,1)=='0') r_date[2]=r_date[2].substr(1,2);
      if(r_date[1].substr(0,1)=='0') r_date[1]=r_date[1].substr(1,2);

      var view_food ='<button type="button" class="btn btn-primary btn-circle"><i class="glyphicon"></i></button>'+
             '<button type="button" class="btn btn-success btn-circle"><i class="glyphicon"></i></button>'+
             '<button type="button" class="btn btn-warning btn-circle"><i class="glyphicon"></i></button>' ;

      if(sClass == 'date-cell not-this-month ' || sClass == 'date-cell not-this-month sun'||sClass == 'date-cell not-this-month sat' ){
        arrTable.push('<td id="'+oStartDt.getFullYear()+'-' +(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate()+ '" class="lastDate" class="'+sClass+'" >' + oStartDt.getDate()+'</br>' +view_food+ '</td>');
      }
      else {
        if(r_date[0]==oStartDt.getFullYear() && r_date[1]==(oStartDt.getMonth()+1) &&r_date[2]== oStartDt.getDate() ){  //현재날짜와 일치할경우
            arrTable.push('<td id="'+oStartDt.getFullYear()+'-' +(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate()+ '" class="rDate" class="'+sClass+'" >'  + oStartDt.getDate() +'</br>'+view_food+ '</td>');
        }
        else{
          arrTable.push('<td id="'+oStartDt.getFullYear()+'-'+(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate()+ '" class="'+sClass+'"  >' + oStartDt.getDate() +'</br>'+view_food + '</td>');
        }
      }

      var today = new Date(m_oMonth.getTime());
      var len =arrTable.length;
    //  if ( arrTable[len] == today )  td.style.backgroundColor = "#bad2ea";

      oStartDt.setDate(oStartDt.getDate() + 1);

      if(i % 7 == 6) {
        arrTable.push('</tr>');
        if(m_oMonth.getMonth() != oStartDt.getMonth()) {
          break;
        }
      }
    }

     arrTable.push('</tbody></table>');
     $('#calendar').html(arrTable.join(""));

    that.changeMonth();
  }


      /* Next, Prev 버튼 이벤트 */
     this.initEvent = function() {
        $('#btnPrev').click(that.onPrevCalendar);
        $('#btnNext').click(that.onNextCalendar);
     }

    /* 이전 달력 */
  this.onPrevCalendar = function() {
    m_oMonth.setMonth(m_oMonth.getMonth() - 1);
    that.renderCalendar();
  }

    /* 다음 달력 */
  this.onNextCalendar = function() {
    m_oMonth.setMonth(m_oMonth.getMonth() + 1);
    that.renderCalendar();
  }

    /* 달력 이동되면 상단에 현재 년 월 다시 표시 */
  this.changeMonth = function() {
    $('#currentDate').text(that.getYearMonth(m_oMonth).substr(0,9));
  }

    /* 날짜 객체를 년 월 문자 형식으로 변환 */
  this.getYearMonth = function(oDate) {
    return oDate.getFullYear() + '년 ' + (oDate.getMonth() + 1) + '월';
  }


  var id_chk= "0000-00-00";

  this.clickDate = $(document).on("click", "td", function() {

    var id = $(this).attr('id');
    if(id !="food"){  //'td'구별하기

    var selectDate = id.split('-');

    var c_date = new Date().toISOString().substr(0, 10).replace('T', ' '); //현재날짜
    var c_date =c_date.split('-');
    if(c_date[1].substr(0,1)=='0') c_date[1]=c_date[1].substr(1,2);
    if(c_date[2].substr(0,1)=='0') c_date[2]=c_date[2].substr(1,2);

    //텍스트바꿔주기
    $('#detail_calendar').text(selectDate[0]+" 년 "+selectDate[1]+" 월 "+selectDate[2]+" 일");
    $('#'+id+'').css("background-color","hsla(200, 100%, 70%, 0.3)");

    //배경색처리
    if(id != id_chk){
      if(id_chk!="0000-00-00"){
        var id_date =id_chk.split('-');
        if(c_date[0]==id_date[0] &&c_date[1]==id_date[1]&&c_date[2]==id_date[2]){//현재날짜인지 체크
          $('#'+id_chk+'').css("background-color","hsla(100, 100%, 70%, 0.3)");
        }
        else if(id_date[1]!=(m_oMonth.getMonth()+1)){ //지난달이던가 다음달이던가
            $('#'+id_chk+'').css("background-color","hsla(5, 7%, 70%, 0.3)");
        }
        else{
            $('#'+id_chk+'').css("background-color","rgba(0, 0, 0, 0)");
          }
      }
      id_chk=id;
    }

    //식단표 뿌려주지
    $('#food').text(selectDate[0]+" 년 "+selectDate[1]+" 월 "+selectDate[2]+" 일");

  }

  });



  $('.breakfirst').click(function(){
    //탭 색변경
    $('.breakfirst').css("background-color","hsla(200, 100%, 70%, 0.3)");
    $('.lunch').css("background-color","hsla(200, 100%, 0%, 0)");
    $('.dinner').css("background-color","hsla(200, 100%, 0%, 0)");
    $('#food').text("아침식단입니다.");
  });

  $('.lunch').click(function(){
    //탭 색변경
    $('.lunch').css("background-color","hsla(200, 100%, 70%, 0.3)");
    $('.breakfirst').css("background-color","hsla(200, 100%, 0%, 0)");
    $('.dinner').css("background-color","hsla(200, 100%, 0%, 0)");
    $('#food').text("점심식단입니다.");
  });

  $('.dinner').click(function(){
    //탭 색변경
    $('.dinner').css("background-color","hsla(200, 100%, 70%, 0.3)");
    $('.lunch').css("background-color","hsla(200, 100%, 0%, 0)");
    $('.breakfirst').css("background-color","hsla(200, 100%, 0%, 0)");
    $('#food').text("저녁식단입니다.");
  });

}