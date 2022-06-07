let winMgr = new AppWindow('winMgr');

function winMgrMain() {
	if (winMgr.display) {
		winMgr.toggle();
	}
	else {
		winMgr.setTitle("Window Manager");
		winMgr.resizeToCenter(600, 400);
		winMgr.create();
		function refresh() {
			let content = '';
			$('#main').children().map(function (i, e) {
				content += $(e).attr('id') + '<br>';
			});
			winMgr.setContent(content);
			console.log("refreshed");
		}
		refresh();
		setInterval(refresh, 1000);
	}
}