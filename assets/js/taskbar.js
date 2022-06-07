// Battery
navigator.getBattery().then(function(battery) {
	function sec2time(sec) {
		let h = Math.floor(sec / 3600);
		let m = Math.floor((sec - h * 3600) / 60);
		let s = sec - h * 3600 - m * 60;
		let r = "";
		if (h > 0) {
			r += h + (h == 1 ? " hour " : " hours ");
		}
		r += m + (m == 1 ? " minute " : " minutes");
		return r;
	}
	function updateBatteryStatus(b) {
		let content = `<div id="batteryDetailIcon"></div>
		<div class="display" style="display: inline-block; height: 72px; font-size: 72px; line-height: 72px; vertical-align: top;">` + b.level * 100 + `%</div>`;
		if (b.charging) {
			$('#battery').attr('class', 'charging');
			$('#battery').attr('title', '(Charging) ' + Math.floor(b.level * 100) + '%');
			content += '<p>Battery is charging.</p>';
			if (b.chargingTime != Infinity) {
				content += b.level == 1 ? '<p>Fully charged.</p>' : '<p>Will be fully charged after ' + sec2time(b.chargingTime) + '.</p>';
			}
			btry.setContent(content);
			$('#batteryDetailIcon').attr('class', 'charging');
		}
		else {
			content += '<p>Battery is not charging.</p>'
			if (b.dischargingTime != Infinity) {
				content += '<p>Will be used up after ' + sec2time(b.dischargingTime) + '.</p>';
			}
			btry.setContent(content);
			if (b.level < 0.25) {
				$('#battery').attr('class', 'low');
				$('#batteryDetailIcon').attr('class', 'low');
			}
			else if (b.level < 0.5) {
				$('#battery').attr('class', 'medium');
				$('#batteryDetailIcon').attr('class', 'medium');
			}
			else if (b.level < 0.75) {
				$('#battery').attr('class', 'high');
				$('#batteryDetailIcon').attr('class', 'high');
			}
			else {
				$('#battery').attr('class', 'full');
				$('#batteryDetailIcon').attr('class', 'full');
			}
			$('#battery').attr('title', Math.floor(b.level * 100) + '%');
		}
		btry.content = $('#batteryDetail .content').html();
	}
	updateBatteryStatus(battery);
	battery.addEventListener('levelchange', function() {
		updateBatteryStatus(battery);
	});
	battery.addEventListener('chargingchange', function() {
		updateBatteryStatus(battery);
	});
	battery.addEventListener('chargingtimechange', function() {
		updateBatteryStatus(battery);
	});
	battery.addEventListener('dischargingtimechange', function() {
		updateBatteryStatus(battery);
	});
});
let btry = new AppWindow("batteryDetail");
btry.create(false);
btry.canSelect(false);
btry.setTitle("Battery");
btry.setContent(
	`<div id="batteryDetailIcon"></div>
	<div class="display" style="display: inline-block; height: 72px; font-size: 72px; line-height: 72px; vertical-align: top;"></div>
	<p>Battery is not detected / supported.</p>
	<p>Currently only supported by Chromium browsers.</p>`
);
$('#battery').click(function() {
	if (btry.display) {
		btry.resize(document.body.clientWidth - 408, document.body.clientHeight - 306, 400, 250, 0);
		btry.toggle();
		$('#batteryDetail').trigger('click');
	}
	else {
		btry.resize(document.body.clientWidth - 408, document.body.clientHeight - 306, 400, 250);
		btry.create();
		btry.canSelect(false);
	}
});


// Time
function updateTime() {
	let d = new Date();
	let h = d.getHours();
	let m = d.getMinutes();
	let s = d.getSeconds();
	let Y = d.getFullYear();
	let M = d.getMonth() + 1;
	let D = d.getDate();
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	let w = days[d.getDay()];
	m = m < 10 ? '0' + m : m;
	s = s < 10 ? '0' + s : s;
	M = M < 10 ? '0' + M : M;
	D = D < 10 ? '0' + D : D;
	$('#time').html(h + ':' + m + '<br/>' + Y + '-' + M + '-' + D);
	time.setContent(
		'<h3 class="display">' + h + ':' + m + ':' + s + '</h3>'
		+ '<p>' + Y + '-' + M + '-' + D + '<br><i>' + w + '</i></p>'
	);
	$('#time').attr('title', Y + '-' + M + '-' + D + '\n' + w);
}
let time = new AppWindow("timeDetail");
time.create(false);
time.setTitle("Time and date");
$('#time').click(() => {
	if (time.display) {
		time.resize(document.body.clientWidth - 208, document.body.clientHeight - 256, 200, 200, 0);
		time.toggle();
		$('#timeDetail').trigger('click');
	}
	else {
		time.resize(document.body.clientWidth - 208, document.body.clientHeight - 256, 200, 200);
		time.create();
	}
});
updateTime();
setInterval(updateTime, 1000);