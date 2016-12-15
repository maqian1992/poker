$(function(){

	function play(){
		function makePoker(){
			//poker 52张不同的牌
			//table = {index+num:true,...} 为了防止poker中有重复的 
			var poker=[];
			var table={};
			// 花色
			var colors=['h','s','c','d'];
			//当poker的长度不为52 会一直循环
			while(poker.length!==52){
				// 取花色和牌数的随机数  floor向下取整  ceil向上取整
				var index=colors[Math.floor(Math.random()*4)]; 
				var num=Math.ceil(Math.random()*13);
				// 创建一个纸牌json
				var v={
					color:index,
					number:num
				}
				// 如果table中没有相应的牌 就将创建好的json放到poker里
				if(!table[index+num]){
					poker.push(v);
					table[index+num]=true;
				}
			}
			return poker;
		}
		var poker=makePoker();
		//console.log(poker)
		function setPoker(poker){
			// 创建一个字典 来转换图片的命名
			var dict={1:'A',2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:'T',11:'J',12:'Q',13:'K'};
			// u来控制放置的纸牌数  poke为根据下标u选出的纸牌
			var u=0;
			var poke;
			// 放置金字塔
			for(var i=0;i<7;i++){
				for(var j=0;j<i+1;j++){
					poke=poker[u];
					u++;
					// 创建一个div,到.screen中,加上类名(pai),加上自定义属性num值为牌数(得13),加上id名值为几行几列(压牌),加上随机选出的背景图片,加上时间延迟,加上动效   
					$('<div>').appendTo('.screen').addClass('pai').attr('num',poke.number).attr('id',i+'-'+j).css({'background-image':'url(image/'+dict[poke.number]+poke.color+'.png)'}).delay(u*50).animate({left:j*110+(6-i)*55,top:i*40,opacity:1}) 
				}
			}
			// 放置剩下的纸牌并加上类名left, u接着上边的值继续++ 直到52张牌 
			for(;u<poker.length;u++){
				poke=poker[u];
				$('<div>').appendTo('.screen').addClass('pai left').attr('num',poke.number).css({'background-image':'url(image/'+dict[poke.number]+poke.color+'.png)'}).delay(u*50).animate({left:110,top:430,opacity:1}) 
			}
		}	
		setPoker(poker);

		function btn(){
			var btnleft=$('.screen .btnleft');
			var btnright=$('.screen .btnright');
			// index 为层级关系
			var index=0;
			// btnleft.on('dblclick',false);
			btnleft.on('click',function(){
				// 点击一次右键将左边的最后一张牌(最上边的一张)放到右边,并且移除类名left 加上类名right
				$('.left').last().css({zIndex:index++}).animate({left:550,marginTop:0}).queue(function(){$(this).removeClass('left').addClass('right').dequeue()});
			})
			var btnnumber=0;
			// btnright.on('dblclick',false);
			btnright.on('click',function(){
				// 如果左边还剩下牌，则点击无效
				if($('.left').length){
					return;
				}
				btnnumber++;
				// 最多只能点击3次
				if(btnnumber>3){
					return;
				}else{
					$('.right').each(function(i,v){
						$(this).delay(i*50).css({zIndex:0}).animate({left:110}).queue(function(){$(this).addClass('left').removeClass('right').dequeue()});
					})
				}
			})
		}
		btn()

		// 返回所点击牌的牌数
		function getpnum(el){
			return parseInt($(el).attr('num'));
		}

		// 判断是否被压着
		function isCanClick(el){
			// 判所点击的牌是否有id
			if(!$(el).attr('id')){
				return true;
			}
			// $(el).attr('id').split('-')[0] 得到一个字符串 所以要parseInt()
			var l=parseInt($(el).attr('id').split('-')[0]);
			var r=parseInt($(el).attr('id').split('-')[1]);
			// 点击5-4时 ，如果有6-4或6-5表示被压着
			if($('#'+(l+1)+'-'+r).length||$('#'+(l+1)+'-'+(r+1)).length){
				return false;
			}else{
				return true;
			}
		}
		var  prev;
		var  scorespan=parseInt($('.score span').text());
		var  overplusspan=parseInt($('.overplus span').text());
		function setclick(){
			// 事件委托 
			$('.screen').on('click','.pai',function(){
				// 判断是否被压着
				if(!isCanClick(this)){
					return;
				}
				// pnum为点击牌的牌数
				var  pnum=getpnum(this);
				$(this).css({'margin-top':'-10px'});
				// detach()从DOM中删除所有点击的元素，不会把匹配的元素从jQuery对象中删除，因而可以在将来再使用这些匹配的元素。与remove()不同的是，所有绑定的事件、附加的数据等都会保留下来。
				// 如果是第一次点击(没有前一张牌)并且点击的是13
				if(!prev&&pnum===13){
					$(this).delay(10).animate({left:900,top:0}).queue(function(){$(this).detach().dequeue()});
					$('.score span').text(scorespan+=10);
					$('.overplus span').text(overplusspan-=1);
					
					if(overplusspan==0){
						alert("恭喜你！游戏成功！")
					}
					return;
				}
				// 如果是第二次点击(第一次点击prev存在){如果第一次和第二次相加得13 删除它们，否则将第一次点击清空 }
				if(prev){
					if(getpnum(prev)+getpnum(this)===13){
						console.log('prev2')
						// add() 把与表达式匹配的元素添加到jQuery对象中
						prev.add(this).animate({left:900,top:0}).queue(function(){$(this).detach().dequeue()});
						$('.score span').text(scorespan+=10);
						$('.overplus span').text(overplusspan-=2);
						if(overplusspan==0){
							alert("恭喜你！游戏成功！")
						}
					}else{
						prev.add(this).css({'margin-top':'0'});
					}
					prev=null;
				}
				// 如果第一次点击(第一次点击prev不存在){创建prev}
				else{
					console.log('prev')
					prev=$(this);
				}
			})
		}
		setclick();
	}
	
	$('.start').on('click',function(){
		if(!$('.pai').length){
			// $('.score span').text(0);	
			// $('.overplus span').text(52);	
	 		play();
		}
		$('.restart').on('click',function(){
			$('.pai').detach();
			$('.score span').text(0);	
			$('.overplus span').text(52);	
			play();		
		})
	})

	$('.end').on('click',function(){
		$('.score span').text(0);	
		$('.overplus span').text(52);
		$('.pai').detach();			
	})

	

})