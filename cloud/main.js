AV.Cloud.define("GetEnemy",function(request,response) {
	var Enemy = AV.Object.extend("Enemy");
	var query = new AV.Query(Enemy);
	query.ascending("updateAt")
	query.count({
	success: function(count) {
		if (count == 0) {
			var enemyId = request.params.enemyId;
			var itObjId = request.params.itObjId;
			var enemy = new Enemy();
			enemy.set("enemyObjectId", enemyId);
			enemy.set("installationObjId", itObjId);
			enemy.save().then(function(obj) {
				response.success("please wait");
			},function (error) {
				response.success("Create Error:" + error.message);
			});
		} else {
			var query = new AV.Query(Enemy);
			query.ascending("updatedAt");
			query.first({
			success: function(object) {
				var objId = object.get("enemyObjectId");
				var itObjId = object.get("installationObjId");
				object.destroy(null);
				var query = new AV.Query("_Installation");
				query.equalTo("objectId",itObjId);
				AV.Push.send({
					where: query,
					data: {
						alert: "Public message"
					}
				});
				//推送
				//AV.Push.send({
				//	channels: ["public"],
				//	data: {
				//		alert: "public message"
				//	}
				//});
  				response.success(objId);
  			},
 			error: function(error) {
  				response.success("Find Enemy Error:" + error.message);
 			}
			});
		}
	},
	error: function(error) {
		response.success("Count Error:" + error.message);
	}
	});	
});
