require(['react','jquery', 'bootstrap', 'build/Table'], function( Table ){
	var column = [
		{ header: "", key: "id", type: "checkbox"},
		{ header: "Status", key: "status", type:"image"},
		{ header: "Type", key: "type"},
		{ header: "From", key: "fromName"},
		{ header: "Date", key: "date"}
	];
	var dataSrc = [
					{
						"id": 9001,
						"name": "Mujibur Rahman",
						"address": "Faridpur,Dhaka",
						"city": "Kuala Lumpur",
						"country": "Malaysia",
						"birthday": "1981-08-26"
					},
					{
						"id": 9002,
						"name": "Afia Rahman",
						"address": "Kamarkhali",
						"city": "Faridpur",
						"country": "Bangladesh",
						"birthday": "2010-12-09"
					},
					{
						"id": 9007,
						"name": "Tahmina Akter",
						"address": "Barisal, Bangladesh",
						"city": "Dhaka",
						"country": "Bangladesh",
						"birthday": "1983-10-31"
					}
		];
	var App = React.createClass({
		render: function(){
			return(
				<div className="table-responsive">
					<TableComponent 
						width={"80%"} 
						controllerName={"/"}
						dataSource={dataSrc}
						columns={column} 
						id={'MessageTable'}
					/>
				</div>
			);
		}
	});
});