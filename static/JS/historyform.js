
// Declare the data variable at the global scope
var data;

    window.onload = function() {
      if (!sessionStorage.getItem('refreshed')) {
        // Refresh the page
        sessionStorage.setItem('refreshed', 'true');
        window.location.reload();
    }
        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "/get_form_data", true);
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
              parsedData = JSON.parse(xhr2.responseText);
                data = JSON.parse(parsedData);

                var table = document.getElementById("mainTable");
                console.log("We have reached")
                console.log(data)

                if (data && Array.isArray(data) && data.length > 0) {
                    var firstFormData = data[0]; // Get the first dictionary from the list
                
                    // Update labels with values from the first dictionary
                    // Assuming firstFormData contains the date in the format 'YYYY-MM-DD HH:MM:SS'
                    var initiationDateTime = firstFormData['InitiationDate'];
                
                    // Extract just the date part
                    var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
                

                    // Assuming firstFormData contains the date in the format 'YYYY-MM-DD HH:MM:SS'
                    var CompletionDateTime = firstFormData['CompletionDate'];

                    // Extract just the date part
                    var CompletionDate = CompletionDateTime ? CompletionDateTime.split(' ')[0] : 'Loading Completion Date ...';


                    // Set default values for stages
                    var stage1 = 'Completed';
                    var stage2 = 'Pending';
                    var stage3 = 'Pending';
                    var stage4 = 'Pending';
                
                    // Check conditions and update stages accordingly
                    if (firstFormData['ApprovalToSend'] === 1) {
                        stage2 = 'Completed';
                    } else if (firstFormData['ApprovalToSend'] === 0) {
                        stage2 = 'Disapproved';
                        // If disapproved, set stage3 and stage4 to disapproved too
                        stage3 = 'Disapproved';
                        stage4 = 'Disapproved';
                    }
                
                    if (firstFormData['CompletionDate'] !== 0) {
                        stage3 = 'Completed';
                    }
                
                    if (firstFormData['ApprovalToReceive'] === 1) {
                        stage4 = 'Completed';
                    }
                
                    // Update HTML elements with the computed stages
                    document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
                    document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';
                    document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
                    document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
                    document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
                    document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
                    document.getElementById("InitiationDate").textContent = initiationDate;
                    document.getElementById("CompletionDate").textContent = CompletionDate;
                
                    // Update stage elements with computed stage values
                    document.getElementById("Stage1").textContent = stage1;
                    document.getElementById("Stage2").textContent = stage2;
                    document.getElementById("Stage3").textContent = stage3;
                    document.getElementById("Stage4").textContent = stage4;
                
                }
                else {
                    console.error("No form data or invalid data format received");
                    }
        


                    data.forEach(function(row, index) {
                        var newRow = table.insertRow();
                        newRow.insertCell(0).textContent = index + 1;
                    
                        // Status cell
                        var statusCell = newRow.insertCell(1);
                        var statusLabel = document.createElement('label');
                    
                        var stage2Text = document.getElementById("Stage2").textContent;
                        if (stage2Text.toLowerCase() === 'disapproved') {
                            statusLabel.textContent = 'Rejected';
                        } else {
                            statusLabel.textContent = row['Reached'] === 1 ? 'Accepted' : 'Rejected';
                        }
                        statusCell.appendChild(statusLabel);
                    
                        // Remaining data cells
                        newRow.insertCell(2).textContent = row['Category'];
                        newRow.insertCell(3).textContent = row['Name'];
                        newRow.insertCell(4).textContent = row['Make'];
                        newRow.insertCell(5).textContent = row['Model'];
                        newRow.insertCell(6).textContent = row['ProductID'];
                        newRow.insertCell(7).textContent = row['SenderCondition'];
                        newRow.insertCell(8).textContent = row['SenderRemarks'];
                        newRow.insertCell(9).textContent = row['ReceiverCondition'];
                        newRow.insertCell(10).textContent = row['ReceiverRemark'];
                    });
                    
                    
                    
           }
        };
        xhr2.send();
    };