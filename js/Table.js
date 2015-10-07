var TableBody = React.createClass({
	render: function(){
		var columns = this.props.columns;
		var data = this.props.data;
		var action = this.props.actions;
		var controller = this.props.controller;
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
	 _rowClickEvent: function( event ){
		var data = this.props.data;
		var rowUrl = this.props.controllerName;
		if( rowUrl) {
			location.href = rowUrl;
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
				return <td style={{cursor: 'pointer'}} id={c.key} key={i} onClick={this._rowClickEvent}>{I(item[c.key])}</td>;
			}, this);
		}.bind(this);
		
		return (
				<tr key={data}>{ td(data) }</tr>
		)
	}
});

var Table = React.createClass({
		getInitialState: function() {
			return {
				data: [],
				dataStyle: [],
				sortDir: "",
				sortColumn: ""
			};
		},
		componentDidMount: function(){
			this.tcId = setTimeout(function(){
				this.setState({data: this.props.dataSource, dataStyle: this.props.rowStyle});
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
					if(!isNaN(x))
						return (x > y ? -1 : 1);
					else
						return y.toString().toLowerCase().localeCompare(x.toString().toLowerCase());
				} else {
					if(!isNaN(x))
						return (x > y ? 1 : -1);
					else
						return x.toString().toLowerCase().localeCompare(y.toString().toLowerCase());
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
			var drawRowSpanHeader = function(){
				if(this.props.colRowSpan != undefined && this.props.colRowSpan.length > 0){
					return <TableTopHeader columns={this.props.colRowSpan} onSort={this.sort} sortDir={this.state.sortDir} sortColumn={this.state.sortColumn} />;
				}
			}.bind(this);

			if( this.state.data ){
				return (
					<table id={this.props.id} width={this.props.width} cellSpacing="1" cellPadding="0" border="0" className="wfTable">
						<thead>
							{ drawRowSpanHeader() }
							<TableHeader columns={columns} onSort={this.sort}  sortDir={this.state.sortDir} sortColumn={this.state.sortColumn}/>
						</thead>
						<TableBody data={this.state.data} controller={controller} columns={columns} actions={this.props.actions} styles={this.state.dataStyle} />
					</table>
				)
			} else{
				return (
					<table></table>
				)
			}
		}
});
var TableTopHeader = React.createClass({
	render: function() {
		var sortDir = this.props.sortDir;
		var sortColumn = this.props.sortColumn;
		var sortArrow = {
			asc : "↓",
			dsc : "↑"
		}
		var columns = this.props.columns;
		var cell = columns.map(function(c, i){
			var arrow = "\u00a0";
			if (c.key == sortColumn) {
				arrow = sortArrow[sortDir];
			}
			return <th onClick={this.sort(c)} rowSpan={c.rowSpan} colSpan={c.colSpan} key={i}><b>{I(c.header)} {arrow}</b></th>;
		}.bind(this));
		return (
			<tr>{ cell }</tr>
		);
	},
	sort: function( column ){
		if(column.key != ""){
			return function( event ){
				var sortDir = this.props.sortDir;
				this.props.onSort(column.key, sortDir);
			}.bind(this);
		}
	}
});
var TableHeader = React.createClass({
	render: function() {
		var sortDir = this.props.sortDir;
		var sortColumn = this.props.sortColumn;
		var sortArrow = {
			asc : "↓",
			dsc : "↑"
		}
		var columns = this.props.columns;
		var cell = columns.map(function(c, i){
				var arrow = "\u00a0";
				if (c.key == sortColumn) {
					arrow = sortArrow[sortDir];
				}
				if(c.header != "")
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