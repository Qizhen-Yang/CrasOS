var windowCount = 0;
var DURATION = 300;
var windowList = new Set();

class AppWindow {
	constructor(id) {
		this.id = id == undefined ? Math.floor(Math.random() * 100000000) : id;
		this.display = false;
		this.x = 0;
		this.y = 0;
		this.w = 400;
		this.h = 300;
		this.content = "";
		this.title = "";
		this.max = false;
	}
	resize(x, y, w, h, duration = DURATION) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.pack(duration);
	}
	resizeToCenter(w, h, duration = DURATION) {
		this.resize(document.body.clientWidth / 2 - w / 2, document.body.clientHeight / 2 - h / 2 - 24, w, h, duration);
	}
	toggleMax() {
		if (this.display) {
			this.max = !this.max;
			$('#' + this.id).toggleClass("max");
		}
		else {
			throw new Error("Window not created");
		}
	}
	create(display = true) {
		if (!this.display) {
			this.display = true;
			windowCount ++;
			windowList.add(this.id);

			$('#main').append('<div id="' + this.id + '" class="window"></div>');

			$('#' + this.id).hide();
			this.pack()
			if (display) {
				$('#' + this.id).fadeIn(DURATION, "swing");
			}

			$('#' + this.id).append(
				`<div class="titlebar">
					<div class="title"></div>
					<div class="close"></div>
				</div>
				<div class="content"></div>`
			);
			$('#' + this.id).css("z-index", windowCount);
			$('#' + this.id + ' .title').text(this.title);
			$('#' + this.id + ' .content').html(this.content);
			
			// Close button
			$('#' + this.id + ' .close').click(() => {
				this.destroy();
			});

			// Maximize
			$('#' + this.id + ' .titlebar').dblclick(() => {
				this.toggleMax();
			});

			// Stuff with z-index
			$('#' + this.id).click(() => {
				let current = parseInt($('#' + this.id).css("z-index"));
				if (current != windowCount) {
					$('#' + this.id).css("z-index", windowCount)
					.siblings().css("z-index", function (i, val) {
						let r = parseInt(val);
						return r > current ? r - 1 : r;
					})
				}
			});

			// Dragging
			$('#' + this.id + ' .titlebar').mousedown((e) => {
				let x = e.pageX;
				let y = e.pageY;
				let sx, sy;
				if (this.max) {
					sx = x - x / document.body.clientWidth * this.w;
					sy = 0;
				}
				else {
					sx = this.x;
					sy = this.y;
				}
				$(document).mousemove((e) => {
					let dx = e.pageX - x;
					let dy = e.pageY - y;
					if (dx >= 5 || dx <= -5 || dy >= 5 || dy <= -5) {
						this.max = false;
						$('#' + this.id).removeClass("max");
						this.resize(sx + dx, sy + dy, this.w, this.h, 0);
					}
				});
				$(document).mouseup((e) => {
					$(document).unbind("mousemove");
					$(document).unbind("mouseup");
				});
			});

		}
		else {
			throw new Error("Window already created");
		}
	}
	pack(duration = DURATION) {
		$('#' + this.id).animate({
			"left": this.x,
			"top": this.y,
			"width": this.w,
			"height": this.h
		}, duration);
	}
	destroy() {
		if (this.display) {
			$('#' + this.id).fadeOut(DURATION, "swing");

			this.display = false;
			windowCount --;

			setTimeout(() => {
				$('#' + this.id).remove()
			}, DURATION);

			let current = parseInt($('#' + this.id).css("z-index"));
			windowList.delete(this.id);
			$('#' + this.id).css("z-index", windowCount)
			.siblings().css("z-index", function (i, val) {
				let r = parseInt(val);
				return r > current ? r - 1 : r;
			})
		}
		else {
			throw new Error("Window not created");
		}
	}
	toggle() {
		if (this.display) {
			$('#' + this.id).fadeToggle(DURATION, "swing");
		}
		else {
			throw new Error("Window not created");
		}
	}
	setTitle(title) {
		this.title = title;
		$('#' + this.id + ' .title').text(this.title);
	}
	setContent(content) {
		this.content = content;
		$('#' + this.id + ' .content').html(this.content);
	}
	setContentUsingMarkdown(content) {
		this.setContent(marked.parse(content));
	}
	canSelect(select) {
		$('#' + this.id).css("user-select", select ? "auto" : "none");
	}
};
