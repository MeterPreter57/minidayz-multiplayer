export async function install(){
	window.open=function(url,target,features){
		console.log(url,target,features);
	}

	let username=prompt("Username:","Player");
	if(!username) return await install();
	window.XMLHttpRequest=class{
		constructor(){
			this.readyState=4;
			this.status=404;
			this.onreadystatechange=null;
			this.onload=null;
			/**
			 * @type {"text"|"json"|"arraybuffer"|"blob"}
			 */
			this.responseType="text";
		}
		/**
		 * 
		 * @param {"GET"|"POST"|"DELETE"} method 
		 * @param {string} url 
		 */
		open(method="GET",url){
			this.url=url;
			this.method=method;
		}
		send(body){
			const that=this;
			this.body=body;
			this.response=this.responseText="";
			if(this.method=="GET" && this.url.indexOf(".")>-1) return fetch(this.url).then(async function(res){
				if(that.responseType=="text") that.response=that.responseText=await res.text();
				if(that.responseType=="json") that.response=that.responseText=await res.json();
				if(that.responseType=="arraybuffer") that.response=that.responseText=await res.arrayBuffer();
				if(that.responseType=="blob") that.response=that.responseText=await res.blob();

				that.status=200;
				if(that.onload) that.onload();
				if(that.onreadystatechange) that.onreadystatechange();
			});

			this.simulate();
		}

		simulate(){
			const that=this;
			const method=this.method;
			const query=new URLSearchParams(this.url.split("?")[1]);
			const body=new URLSearchParams(this.body);
			let router=this.url;
			if(this.url.indexOf("?")!=-1) router=this.url.split("?")[0];
			if(!router.startsWith("/")) router=`/${router}`;
			// console.log(method,router,query,body);
			function response(object){
				that.status=200;
				that.responseText=JSON.stringify(object);
				console.log("✅",that.responseText);
			}
			console.log("➡️",method,router,"QUERY:",query,"BODY:",body)
			if(method=="GET"){
				if(router=="/api/auth"){
					response({token_user:"token_user",token_refresh:"true",client_id:"C7VX",bi_account_url:"bi_account_url",user_data_url:"user_data_url",saved_game_url:"saved_game_url/"});
				}
				if(router=="/user_data_url" && query.get("access_token")){
					if(!query.get("key")){
						response({have_game:["SPROCKET2DAYZMINI001"]});
					}else{
						response({username:username,username2:username,username3:username});
					}
				}
				if(router=="/saved_game_url/default-char"){
					if(localStorage.getItem(router)!==null) response(JSON.parse(localStorage.getItem(router)));
				}
			}
			if(method=="POST"){
				if(router=="/saved_game_url/default-char"){
					response(true);
					localStorage.setItem(router,JSON.stringify({get_char:body.get("data")}));
				}
			}
			if(method=="DELETE"){
				response({saved_game_url:"1",del_stats:true});
				localStorage.removeItem(router);
			}
			// All triggers from response
			requestAnimationFrame(function(){
				that.onreadystatechange();
			})
		}
	}
}
