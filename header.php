<?php if (qw_user_is('root') || $_SERVER['HTTP_HOST']!=='localhost'): ?>
<script type="text/javascript">
	//Google Analytics code;
	var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-11169667-6']);
		_gaq.push(['_trackPageview']);
		
		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
			
</script>
<?php endif; ?>