define([scriptSrcPath + 'common/require-config.js', 'build/TableButton'], function(CentionButton){
	var TableButton = require('build/TableButton');
	var TableBody = React.createClass({
		render: function(){
			var columns = this.props.columns;
			var data = this.props.data;
			var action = this.props.actions;
			var controller = this.props.controller;
			var arr = data.map(function(el){
				return el;
			});
			var arr = jQuery.map(data, function(el){ 
				return el; 			  
			});
			return (
					<tbody>
						{ arr.map(function(item, idx){
								return <TableRow key={idx} controllerName={controller} data={item} columns={columns} actions={action} />;
							})
						}
					</tbody>
			)
		}
	});

	var TableRow = React.createClass({
		 actionUrl: function( url, data ) {
			var regExp = /\{([^}]+)\}/g;
			var matches = url && url.match(regExp);
			if(matches) {
				for (var i = 0; i < matches.length; i++){
					var str = matches[i];
					var c = str.substring(1, str.length - 1);
					for(var item in data) {
						if(item == c)
							url = url.replace(str, data[item]);
					}
				}	
			}
			return url;
		},
		checkboxHandleChange: function(e) {
			var url = this.actionUrl(e.target.value, this.props.data)
			jQuery.get(url).done(function( data ){
				location.reload();
			}.bind(this)).fail(function(error, a, b) {
				console.log("Error loading JSON: ", error);
			});
		},
		_rowClickEvent: function( event ){
			var data = this.props.data;
			var rowUrl = this.props.controllerName;
			if( rowUrl) {
				var url = this.actionUrl(rowUrl, data);
				location.href = url;
			} else {
				event.stopPropagation();
			}
		},
		render: function() {
			var columns = this.props.columns;
			var data = this.props.data;
			var action = this.props.actions;
			var controller = this.props.controllerName;
			var td = function( item ) {
				return columns.map(function(c, i) {
					if( c.type == 'button' ){
						var requetUri = c.data.action;
						if((c.data.actionType == "ajax-request" || c.data.actionType == "popup-data") && c.data.requestParams){
							var params = decodeURIComponent(jQuery.param(c.data.requestParams));
							requetUri = c.data.action + "?" + params;
						}
						if(c.key && !item[c.key]){
							return  <td  key={"button" + i}><TableButton action={this.actionUrl(requetUri, data)} src={c.data.altSrc} buttonName={c.data.altName} color={c.data.altColor} actionType={c.data.actionType} /></td>;
						} else{
							return  <td  key={"button" + i}><TableButton action={this.actionUrl(requetUri, data)} src={c.data.src} buttonName={c.data.name} color={c.data.color} actionType={c.data.actionType} /></td>;
						}
					}
					else if( c.type == 'checkbox' ) {
						var requetUri = c.data.action;
						if(c.data.actionType == "ajax-request" && c.data.requestParams){
							var params = decodeURIComponent(jQuery.param(c.data.requestParams));
							requetUri = c.data.action + "?" + params;
						}
						return <td  key={"button" + i}><input type={"checkbox"} id={c.key + i} value={requetUri} checked={item[c.key]} onChange={this.checkboxHandleChange} /></td>;
					}
					else{
						return <td style={{cursor: 'pointer'}} id={c.key} key={i} onClick={this._rowClickEvent}>{I(item[c.key])}</td>;
					}
				}, this);
			}.bind(this);
			return (
					<tr key={data}>{ td(data) }</tr>
			)
		}
	});

	var TableComponent = React.createClass({
			getInitialState: function() {
				return {
					data: [],
					sortDir: "",
					sortColumn: ""
				};
			},
			componentDidMount: function(){
				this.tcId = setTimeout(function(){
					this.setState({data: this.props.dataSource});
				}.bind(this), 10);
			},
			componentWillUnmount: function(){
				clearInterval(this.tcId);
			},
			sortByColumn: function(array, column, sortDir) {
				return array.sort(function(a, b) {
					var x = a[column];
					var y = b[column];
					if (sortDir === 'asc') {
						return x.toString().toLowerCase().localeCompare(y.toString().toLowerCase());
					} else {
						return y.toString().toLowerCase().localeCompare(x.toString().toLowerCase());
					}
				});
			},
			sort: function( column ){
				if (column != this.state.sortColumn) {
					this.state.sortDir = 'asc';
					this.state.sortColumn = column;
				}
				var sortDir = this.state.sortDir;
				var data = this.state.data;
				if( column != 'undefined' && column){
					var sortedData = this.sortByColumn(data, column, sortDir);
					this.setState({data: sortedData});
					sortDir = (sortDir === 'asc' ? 'dsc' : 'asc');
					this.setState({sortDir: sortDir});
				}
			},
			render: function(){
				var columns = this.props.columns;
				var controller = this.props.controllerName;
				if( this.state.data ){
					return (
						<table id={this.props.id} width={this.props.width} cellSpacing="1" cellPadding="0" border="0" className="wfTable">
							<thead>
								<TableHeader columns={columns} onSort={this.sort}  sortDir={this.state.sortDir} sortColumn={this.state.sortColumn}/>
							</thead>
							<TableBody data={this.state.data} controller={controller} columns={columns} actions={this.props.actions} />
						</table>
					)
				} else{
					return (
						<table></table>
					)
				}
			}
	});
	var TableHeader = React.createClass({
		render: function() {
			var sortDir = this.props.sortDir;
			var sortColumn = this.props.sortColumn;
			var sortArrow = {
				asc : "▼",
				dsc : "▲"
			}
			var columns = this.props.columns;
			var cell = columns.map(function(c, i){
					var arrow = "\u00a0";
					if (c.key == sortColumn) {
						arrow = sortArrow[sortDir];
					}
					return <th onClick={this.sort(c)} className={"headerSortUp"} style={{ textAlign: 'left'}} key={i}>{I(c.header)} {arrow}</th>;
				}.bind(this));

			return (
				<tr key="headerRow">{ cell }</tr>
			);
		},
		sort: function( column ){
			return function(event){
				var sortDir = this.props.sortDir;
				this.props.onSort(column.key, sortDir);
			}.bind(this)
		}
	});
	return TableComponent;
});
