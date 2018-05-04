var formId = document.getElementById("issueInputForm");
var issueList=[];
formId.onclick = function(event)
{
	event.preventDefault();
	var target = event.target;
	if(target.tagName != 'BUTTON')
	return;
	
	var desc = document.getElementById("issueDescInput").value;
	var severity = document.getElementById("issueSeverityInput").value;
	var assigned = document.getElementById("issueAssignedToInput").value;
	 var issueId = chance.guid();
	 var issueStatus = "open";
		var issue = {
			
			description:desc,
			severity:severity,
			assignedValue:assigned,
			id:issueId,
			issueStatus:issueStatus
		}
		
		issueList.push(issue);
		
		localStorage.setItem('issuelist' , issueList);
		saveIssue(issue);
	
	event.stopPropagation(); 
	
}

function saveIssue(issue)
{
	var div = document.getElementById("issuesList");
	var newDiv = document.createElement("div");
	newDiv.classList.add("well");
	newDiv.innerHTML = "<h3> Issue Id  <span>"+issue.id +"</span></h3><p>status - <span class='label label-info'>  "+issue.issueStatus+"</span></p>"+
						"<p><h2>"+ issue.description+"</h2></p><p><span class='glyphicon glyphicon-time'>"+ issue.severity +"        " +"</span><span class='glyphicon glyphicon-user'>"+issue.assignedValue+"</span></p>"+
						"<div><button class='btn-warning' onclick='closetTicket(event)'>Close</button><button class='btn-danger' onclick='deleteIssue()'>Delete</button></div>"
	div.append(newDiv);
	
	
	
}

function closetTicket(event)
{
	var target = event.target;
	var id = target.parentElement.parentElement.children[0].children[0].innerHTML ;
	var value = confirm("are you sure")
	if(value)
	{
	target.parentElement.parentElement.children[1].children[0].innerHTML = "Closed";
	for(var i =0;i<issueList.length;i++)
	{
		if(issueList[i].id == id)
		{
			issueList[i].issueStatus = "closed"
		}
	}
	}
}

function deleteIssue()
{
	var target = event.target;
	var parentele = target.parentElement.parentElement;
	var id = target.parentElement.parentElement.children[0].children[0].innerHTML;
	for(var i =0;i<issueList.length;i++)
	{
		if(issueList[i].id == id)
		{
			issueList.splice(i,1);
		}
	}
	
	parentele.style.display ="none";
}

