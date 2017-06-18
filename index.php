<?php
	include 'core.php';
	date_default_timezone_set('Europe/Minsk');
	
	function format_time_tag($time){
		$now = time();
		$span = $now - $time;
		$days = floor($span/86400);
		if ($days > 7){
			$res = date('d F Y',$time);
		}else if($days > 1){
			$res = $days.' days ago';
		}else if($days == 1){
			$res = 'a day ago';
		}else{
			$hours = floor($span / 3600);
			if ($hours > 1){
				$res = $hours.' hours ago';
			}else if ($hours == 1){
				$res = "an hour ago";
			}else{
				$min5 = floor($span / 300);
				if ($min5 >= 1){
					$res = ($min5 * 5)." minutes ago";
				}else{
					$res = "just posted";
				}
			}
		}
		return sprintf('<time datetime=%s>%s</time>',date('Y-m-d H:i:s  ',$time), $res);
	}
	
	if ($_SERVER['REQUEST_METHOD']==="POST"){
		if (isset($_POST['name'])&&isset($_POST['email'])&&isset($_POST['comment'])){
			$db->Insert('comments',
				$comment = array(
					'name'=>$_POST['name'],
					'email'=>$_POST['email'],
					'comment'=>$_POST['comment'],
					'submited'=>time(),
					'page_id'=>1,
					'status'=>0
				));
		}
	}
	
	$comments = $db->Get('comments',array('page_id'=>1));
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE" />
		<title>Drawer - The easiest way to draw online.</title>
		<link rel="stylesheet" type="text/css" media="all" href="style.css">		
		<? include 'header.php'; ?>
	</head>
	<body>
		<article>
			<header>
				<img src="images/block-schema.jpg" alt="Block-schema" id=block-schema />
				<figure id=logo>
					<img src="images/logo.gif" width=218 height=56 alt="Drawer" title="Drawer" />
					<figcaption id="slogan">The easiest way to draw online.</figcaption>
				</figure>
				<banner id=button><a href="drawer.php"><img src="images/try-it.gif" width=310 height=87 alt="Don't wait! Try Drawer right now!" /></a></banner>
				<article id=func>
					<h1>About Drawer</h1>
					<ul>
						<li>Allows you to draw any figure you want</li>
						<li>No tools, only your mouse and keyboard</li>
						<li>Drawer makes your figures smooth</li>
						<li>And more...</li>
					</ul>
				</article>
				<hr/>
			</header>
			<article>
				<h1>What's Drawer?</h1>
				<p>Drawer is online drawing tool for creating simple block-schemes.</p>

				<h1>Drawing figures with Drawer.</h1>
				<p>Creating figures with drawer is really easy - you have just to draw it with the mouse! 
				To start drawing - just point your mouse to the place where you want to create a figure, press left 
				button on the mouse and draw a closed line. Don't worry if your line or the outlined figure
				aren't absolutely straight - drawer will fix it!</p>
				<p>Got wrong figure? Just cross (X-cross) it!</p>
				
				<h1>Dragging of figures.</h1>
				<p>As soon as you create your figures you can drag them! Try it! It's really cool!</p>
				
				<h1>Drawing connections between figures.</h1>
				<p>Don't you know? If you draw a straight line between two figures - they will be connected! 
				What does it mean? When you drag one of the figure - the connection will be updated automatically!</p>
				
				<h1>Typing text with Drawer.</h1>
				<p>Click at the place where you need to type your text and then just type it! It's easy, isn't it?</p>
				<p>One cool feature about your text - if you type a text inside any figure it will be connected 
				to it, so you'll drag it with the figure. Try it and see!</p>
				
				<h1>It's not the end!</h1>
				<figure id=twitter>
					<a href="http://twitter.com/Oleg_Oshkoderov" title="Follow me on Twitter!"><img src="images/follow-me.gif" width="100" height="63"/>
					<figcaption>Follow-me</figcaption></a>
				</figure>
				<p>I continue working on Drawer, so even more cool features are comming soon. Don't miss it! Follow me on the Twitter!</p>				
				
				<hr/>
				<p>Comments</p>
				<?php 
					$prev_name = '';
					foreach($comments as $comment): 
				?>
				<article class="comment">
					<?if ($prev_name!=$comment['name']):?>
						<header><?=htmlspecialchars($comment['name']); ?></header>
						<footer><?=format_time_tag($comment['submited']); ?></footer>
					<? endif; ?>
					<div><?=htmlspecialchars($comment['comment']);?></div>
				</article>
				<?php 
					$prev_name = $comment['name'];
				endforeach; ?>
			</article>
			<form action="" method="post">
				<input type=hidden name=comment-id value=<?=time();?>/>
				<div><input type=text name=name /><label for=name>Name</label></div>
				<div><input type=email name=email /><label for=email>e-mail</label></div>
				<div><textarea name=comment cols=70 rows=3></textarea><input type=submit value="Leave comment" /></div>
			</form>
			<footer>
				<hr/>
				<small>Copyright (C) 2010, Oleg Oshkoderov</small>
			</footer>
		</article>
	</body>
</html>