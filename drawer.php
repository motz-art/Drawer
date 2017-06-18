﻿<?php
	include 'core.php';
	
	if (isset($_POST['svgXMLData'])){
		header('Content-type: image/svg+xml');
		header('Content-Disposition: attachment; filename="drawing.svg"');
		echo $_POST['svgXMLData'];		
		exit;
	}
	
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE" />
		<title>Drawer - Your drawing</title>
		<link rel="stylesheet" type="text/css" media="all" href="style.css">		
		<style>
			header{
				width: 980px;
				margin: 30px auto 0px auto;
			}
			#textTyping{
				position: absolute;
				visibility: hidden;
				border: none;
				background:transparent;
				left: 0px;
				top: 0px;
			}
			#export{
				float: right;
				clear: right;
				margin: 0 20px 0 5px;
			}
			#drawerFrame{
				position: relative;
				background-color: rgba(240, 240, 240, 0.9);
				border: 2px solid #004080;				
				clear: both;
				height: 800px;
				width: 1200px;
			}
			#footer .article{
				float: left;
			}
			#twitter{
				float: right;
			}
		</style>
		<script src="geometry.js"></script>
		<script src="svglib.js"></script>
		<script src="drawer.js"></script>
		<script src="drawing.js"></script>
		<script language="javascript">
			function loaded(){
				window.svg = createDrawer(getSVG('svgImage'));				
			}
			function saveSVG(){
				document.getElementById('svgXMLData').value = new XMLSerializer().serializeToString(window.svg.ownerDocument);
				document.getElementById('drawerForm').submit();
			}
			function adjustSize(e){
				nCols = e.currentTarget.cols;
				sVal = e.currentTarget.value;
				nVal = sVal.length;
				nRowCnt = 1;
				nColl = 0;

				for (i=0;i<nVal;i++)
				{ 
					nColl++;
					if (sVal.charAt(i) == "\n" || nColl > nCols) 
					{ 
						nRowCnt +=1;
						nColl = 0;
					}
				}

				if (nRowCnt < (nVal / nCols)) { nRowCnt = 1 + (nVal / nCols); }
				e.currentTarget.rows = nRowCnt+1; 				
			}
			</script>
			<?php include 'header.php'; ?>
	</head>
	<body>
			<header>
				<figure id=logo>
					<a href="/"><img src="images/logo.gif" width=218 height=56 alt="Drawer" title="Drawer" /></a>
					<figcaption id="slogan">The easiest way to draw online.</figcaption>
				</figure>
				<img src="images/export.jpg" id="export" width="217" height="93" onclick="saveSVG()" />
			</header>
			
	<form id="drawerForm" action="drawer.php" method="post">
			<div id="drawerFrame">
				<textarea id="textTyping" onkeypress="adjustSize(event)" cols="20" row="2"></textarea>
				<object data="test.svg" width="1200" height="800" type="image/svg+xml" id="svgImage" onload="loaded()"></object>
			</div>
			<input type=hidden id="svgXMLData" name="svgXMLData" />
		</form>
		<div id="footer" role="footer">
			<div id=twitter>
				<a href="http://twitter.com/Oleg_Oshkoderov" title="Follow me on Twitter!"><img src="images/follow-me.gif" width="100" height="63"/></a>
			</div>
		</div>
	</body>
</html>