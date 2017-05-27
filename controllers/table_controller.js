var table = new controller();
table.init();




function controller(target){

    var that =this;
    var m_oMonth = new Date();
    m_oMonth.setDate(1);

    this.init = function(){
        that.renderCalendar();
        that.initEvent();
        that.clickDate();
        that.clickFood();
    }


    this.renderCalendar = function(){
        var arrTable =[];

        arrTable.push('<table class="table table-bordered">');
        arrTable.push('<thead><tr>');

        var arrWeek = "날짜 이미지 메뉴 메뉴 메뉴 메뉴 메뉴 메뉴 버튼".split(" ");

        for(var i=0, len=arrWeek.length; i<len; i++) {
            var sClass = '';
            if(i==1){
                arrTable.push('<td  width="70px" class="'+sClass+'">' + arrWeek[i] + '</td>');
                continue;
            }
            arrTable.push('<td class="'+sClass+'">' + arrWeek[i] + '</td>');
        }
        arrTable.push('</tr></thead></table>');


        var oStartDt = new Date(m_oMonth.getTime());
        // 1일에서 1일의 요일을 빼면 그 주 첫번째 날이 나온다.
        oStartDt.setDate(oStartDt.getDate() - oStartDt.getDay());

        for(var i=0; i<35; i++) {
            for(var j = 0; j < 3; j++){

            var sClass = 'date-cell ';
            sClass += m_oMonth.getMonth() != oStartDt.getMonth() ? 'not-this-month ' : '';





            if(sClass == 'date-cell not-this-month ' || sClass == 'date-cell not-this-month sun'||sClass == 'date-cell not-this-month sat' ){
                break;
            }
            else {
                arrTable.push('<form action="/mealRegister" method="post" enctype="multipart/form-data"><table class="table table-bordered"><tbody>'); // 메뉴 입력

                var dateValue = oStartDt.getFullYear()+'-' +(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate();
                arrTable.push('<tr><input name="mealDate" type="hidden" value='+dateValue+'>');

                var st_date = new Date().toISOString().substr(0, 10).replace('T', ' ');
                var r_date =st_date.split('-');
                //  console.log(r_date[1]);
                if(r_date[2].substr(0,1)=='0') r_date[2]=r_date[2].substr(1,2);
                if(r_date[1].substr(0,1)=='0') r_date[1]=r_date[1].substr(1,2);

                if(j == 0){
                    arrTable.push('<td width="150px" nowrap id="'+oStartDt.getFullYear()+'-' +(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate()+ '"  class="'+sClass+'" >'  + oStartDt.getDate()+'일 아침' +'</td>');
                    arrTable.push('<td><input type="file" name="morningImage"></td>');
                    arrTable.push('<td><input type="text" name="morningMenu1"></td>');
                    arrTable.push('<td><input type="text" name="morningMenu2"></td>');
                    arrTable.push('<td><input type="text" name="morningMenu3"></td>');
                    arrTable.push('<td><input type="text" name="morningMenu4"></td>');
                    arrTable.push('<td><input type="text" name="morningMenu5"></td>');
                    arrTable.push('<td><input type="text" name="morningSideMenu"></td>');
                    arrTable.push('<td><input type="submit"></td>');
                }else if(j==1){
                    arrTable.push('<td width="150px" nowrap id="'+oStartDt.getFullYear()+'-' +(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate()+ '"  class="'+sClass+'" >'  + oStartDt.getDate()+'일 점심' +'</td>');
                    arrTable.push('<td><input type="file" name="lunchImage"></td>');
                    arrTable.push('<td><input type="text" name="lunchMenu1"></td>');
                    arrTable.push('<td><input type="text" name="lunchMenu2"></td>');
                    arrTable.push('<td><input type="text" name="lunchMenu3"></td>');
                    arrTable.push('<td><input type="text" name="lunchMenu4"></td>');
                    arrTable.push('<td><input type="text" name="lunchMenu5"></td>');
                    arrTable.push('<td><input type="text" name="lunchSideMenu"></td>');
                    arrTable.push('<td><input type="submit"></td>');
                }else{
                    arrTable.push('<td width="150px" nowrap id="'+oStartDt.getFullYear()+'-' +(oStartDt.getMonth()+1)+ '-' +oStartDt.getDate()+ '"  class="'+sClass+'" >'  + oStartDt.getDate()+'일 저녁' +'</td>');
                    arrTable.push('<td><input type="file" name="dinnerImage"></td>');
                    arrTable.push('<td><input type="text" name="dinnerMenu1"></td>');
                    arrTable.push('<td><input type="text" name="dinnerMenu2"></td>');
                    arrTable.push('<td><input type="text" name="dinnerMenu3"></td>');
                    arrTable.push('<td><input type="text" name="dinnerMenu4"></td>');
                    arrTable.push('<td><input type="text" name="dinnerMenu5"></td>');
                    arrTable.push('<td><input type="text" name="dinnerSideMenu"></td>');
                    arrTable.push('<td><input type="submit"></td>');
                }
            }
            arrTable.push('</tr>');
            arrTable.push('</tbody></table></form>');
            }
            oStartDt.setDate(oStartDt.getDate() + 1);
        }

        $('#Table').html(arrTable.join(""));

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

}