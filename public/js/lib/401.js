window.seconds = 10;
window.onload = function()
{
	if (window.seconds != 0)
	{
		$('#secondsDisplay').innerHTML = '' + window.seconds;
		window.seconds--;
		setTimeout(window.onload, 1000);
	}
	else
	{
		window.location = '/signin';
	}
}