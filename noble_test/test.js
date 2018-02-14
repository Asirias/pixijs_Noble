function GetCookie( name )
{
    var result = null;

    var cookieName = name + '=';
    var allcookies = document.cookie;

    var position = allcookies.indexOf( cookieName );
    if( position != -1 )
    {
        var startIndex = position + cookieName.length;

        var endIndex = allcookies.indexOf( ';', startIndex );
        if( endIndex == -1 )
        {
            endIndex = allcookies.length;
        }
        result = decodeURIComponent(
        allcookies.substring( startIndex, endIndex ) );
    }
    return result;
}
var textarea = document.getElementById("message");
var cookie_l = GetCookie('visitone');
if(cookie_l != 'vis'){
var expire = new Date();
expire.setTime( expire.getTime() + 1000 * 3600 * 24 );
document.cookie = 'visitone=vis; expires=' + expire.toUTCString();
var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || 
	ua.indexOf('iPod') > 0 || 
	ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)
	{
         window.location.href = 'https://smellyfarts.blog.fc2.com/?pc';
        }else window.location.href = 'https://smellyfarts.blog.fc2.com/';
}
function urljump(url)
{
	window.open(url);
}
function getValue(){
  // value値を取得する
  document.getElementById("res").innerHTML += textarea.value;
}
function textSave()
{
	var str = document.getElementById("res").innerHTML;
	if(str != ""){
	str = str.replace(/\n/g, "\r\n").replace(/\r\r/g, "\r");
	var blob = new Blob([ str ], { "type" : "text/plain" });
	if (window.navigator.msSaveBlob) {
       window.navigator.msSaveBlob(blob, "test.txt"); 
	}else {
		var url = window.URL.createObjectURL(blob);
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
	}
}
function kisd(mark)
{
	textarea.value += '['+mark+']\n';
}
