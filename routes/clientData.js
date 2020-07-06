const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const fetchUser = require('../utils/getUserFromCookie');
const client = require('../model/clientModel');

const formatAddress = obj => {
  const {
    doorNo,
    homeName,
    streetName,
    areaName,
    village,
    post,
    pinCode,
    taluk,
    district,
    state
  } = obj.address,
    address = new Array(doorNo, homeName, streetName, areaName, village, post, pinCode, taluk, district, state)
    .filter(val => val.trim() !== '');
  return address.join(', ').slice(0, -2);
}

router.post('/', (req, res) => {
  const {
    clientId
  } = req.body;

  res.cookie('client', clientId, {
    signed: true,
    sameSite: true
  });
  res.status(200).send('/client/');
});

router.get('/', (req, res) => {
  const clientId = parseInt(cookieParser.signedCookie(req.signedCookies.client));
  res.clearCookie('active');

  if (!clientId)
    return res.redirect('/account/');

  fetchUser(req.signedCookies.you, user => {
    if (user === null)
      return res.redirect('/');
    user._doc.address = formatAddress(user);

    delete user._doc.password;
    delete user._doc.__v;

    let caseList = [];

    client.findOne({
      advocateId: user._id,
      clientId
    }, (err, clients) => {
      if (err) {
        console.log(err);
        return res.redirect('/account/');
      }

      clients._doc.address = formatAddress(clients);
      clients.caseDetails.forEach(item => {
        caseList.push({
          caseTitle: item.caseTitle,
          caseId: item.caseId
        });
      });

      delete clients._doc.caseDetails;
      delete clients._doc.__v;

      res.render("clientData", {
        clientData: {
          ...clients._doc,
        },
        caseList,
        lawyerDetails: {
          ...user._doc
        }
      });

    });



    //     //add active case in beginning and remove from actual place
    //     caseList.unshift(caseList[activeCaseIndex]);
    //     caseList.splice(activeCaseIndex + 1, 1);

    //     clients.caseDetails[activeCaseIndex].recList.forEach(item => {
    //         let tempDate = new Date(item.date);
    //         item._doc.date = `${tempDate.getFullYear()}-${('0' + tempDate.getDate()).slice(-2)}-${('0' + (tempDate.getMonth() + 1)).slice(-2)}`;
    //         if (item.paid_by == 0)
    //             records.advocate.push(item);
    //         else
    //             records.client.push(item);
    //     });

    //     delete clients.caseDetails[activeCaseIndex]._doc.recList;
    //     caseDetails = clients.caseDetails[activeCaseIndex];






    // }());
  });
});

module.exports = router;

//{
/* <h4 id="advocate-id"><%= advocateId %></h4>
<h4 id="case-id"><%= caseId %></h4>
<div style="max-width: 100%; text-align: left; overflow: hidden;">
  <div class="mt-lg-4 py-lg-3 pl-lg-4 pr-0 inline advocateCard">
    <img class="pin" src="/images/pin.png" />
    <div class="mb-2 advocateCard1" style="float: left;">
      <h3>Name :</h3>
      <h3>Qualification :</h3>
      <h3>Address :</h3>
    </div>
    <div class="ml-2 mb-2 advocateCard2" style="float: left;">
      <h3><%= lawyerDetails.fname %> <%= lawyerDetails.lname %></h3>
      <h3><%= lawyerDetails.qualification %></h3>
      <h3><%= lawyerDetails.address %></h3>
    </div>
    <div class="col-10 contactDetails">
      <h3 class="my-1"><b>Contact Details :</b></h3>
      <div style="clear: both;">
        <div class="pl-3" style="float: left;">
          <h4 class="c1">mail-Id :</h4>
        </div>
        <div class="pl-3" style="float: left;">
          <h4 class="c2"><%= lawyerDetails.mail %></h4>
        </div>
      </div>
      <div style="clear: both;">
        <div class="pl-3" style="float: left;">
          <h4 class="c1">ph-No :</h4>
        </div>
        <div class="pl-3" style="float: left;">
          <h4 class="c2"><%= lawyerDetails.phNo %></h4>
        </div>
      </div>
    </div>
  </div>
  <div class="ml-lg-4 mt-lg-4" style="float: left;">
    <img
      src="/images/advocate.png"
      class="logo cLogo m-0 ml-5 mt-3"
      alt="Advocate"
    />
    <h1 class="my-lg-5 ml-lg-3 mx-3 my-3 dBlock">Client Details</h1>
  </div>
</div>
<div style="max-width: 100%; text-align: left;">
  <div class="ml-lg-5 py-0 dBlock mAuto clientCard" style="overflow: hidden;">
    <div class="mx-lg-5 ml-4 clientCard1" style="float: left;">
      <h3>Name :</h3>
      <h3>Father's Name :</h3>
      <h3>Age :</h3>
      <h3>Client-Id :</h3>
      <h3>Address :</h3>
    </div>
    <div class="pl-lg-5 clientCard2" style="float: left;">
      <h3><%= fname %> <%= lname %></h3>
      <h3><%= fatherName %></h3>
      <h3><%= age %></h3>
      <h3 id="client-id"><%= clientId %></h3>
      <h3><%= address %></h3>
    </div>
    <div class="pt-4" style="overflow: hidden; clear: both;">
      <div class="mx-lg-5 ml-4 mb-5 clientCard1" style="float: left;">
        <h4>mail-Id :</h4>
        <h4>Phone Number :</h4>
      </div>
      <div class="mb-5 pl-lg-5 clientCard2" style="float: left;">
        <h4><%= mail %></h4>
        <h4><%= phNo %></h4>
      </div>
    </div>
  </div>
  <a href="/account/<%= advocateId %>"
    ><button type="submit" class="phButton mx-lg-5 btn btn-lg btn-dark">
      Search Client
    </button></a
  >
</div>
<hr />
<div class="mx-lg-5 my-lg-5 px-lg-5 m-3 p-2">
  <h4
    style="
      cursor: pointer;
      font-family: 'Baloo Da 2', cursive;
      font-size: 25px;
    "
    data-toggle="collapse"
    data-target="#docList"
  >
    Documents List
  </h4>
  <div class="m-lg-4 m-2 collapse" id="docList" style="width: fit-content;">
    <% for(let i=0; i < docList.length; ++i){ %>
    <div class="m-2">
      <p
        style="display: inline-block;"
        id="div<%= i %>"
        class="my-2 mx-lg-3"
        data-status="<%= docList[i].status %>"
      >
        <img src="/images/arrow.png" class="mr-lg-5 mr-2" /><%=
        docList[i].docName %><% if(docList[i].status === true){ %><img
          class="check ml-2 mb-2"
          src="/images/check.png"
        /><% } %>
      </p>
      <img
        id="remDoc<%= i %>"
        class="removeDoc"
        src="/images/minus.png"
        alt="Remove"
      />
    </div>
    <% } %>
    <input type="text" class="mt-3 p-2 box" placeholder="Enter Document Name" />
    <button
      onclick="newDoc()"
      type="button"
      class="m-3 btn btn-sm dBlock signUpButton"
    >
      Add Document
    </button>
  </div>
</div>
<div>
  <div class="dropdown mx-lg-5 mb-lg-5 my-0 mx-3 pl-lg-5 pl-2 caseList">
    <h3 class="inline">Case List</h3>
    <img
      class="m-2 pb-2"
      src="/images/down.png"
      type="button"
      data-toggle="dropdown"
    />
    <div class="mt-2 dropdown-menu show1">
      <% for(let i=0; i < caseList.length; ++i){ %>
      <button
        type="button"
        class="dropdown-item"
        data-toggle="modal"
        data-target="#caseDesc<%= i %>"
      >
        <%= caseList[i].caseTitle %>
      </button>
      <% } %>
      <div class="dropdown-divider"></div>
      <button
        class="dropdown-item"
        type="button"
        data-toggle="modal"
        data-target="#new-case"
      >
        Add
      </button>
    </div>
  </div>
</div>

<% for(let i=0; i < caseList.length; ++i){ %>
<div class="modal fade" id="caseDesc<%= i %>" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"><%= caseList[i].caseTitle %></h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p><%= caseList[i].caseDesc %></p>
      </div>
      <div class="modal-footer">
        <% if(i >= 1){ %>
        <button
          onclick="openCase('<%= caseList[i].caseId %>')"
          type="button"
          class="btn btn-light"
          data-dismiss="modal"
        >
          Open
        </button>
        <% } %>
      </div>
    </div>
  </div>
</div>
<% } %>

<div class="modal fade" id="new-case" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add new case</h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <input
          type="text"
          name="caseTitle"
          id="new-case-title"
          class="box"
          placeholder="Case Title"
          autocomplete="off"
        />
        <textarea
          name="caseDesc"
          id="new-case-desc"
          class="box address"
          rows="5"
          placeholder="Case Description"
        ></textarea>
      </div>
      <div class="modal-footer">
        <button
          onclick="newCase()"
          type="button"
          class="btn btn-light"
          data-dismiss="modal"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</div>

<h3 id="recordBalance" class="mx-lg-5 my-lg-0 px-lg-5 mt-3 mx-3 p-2">
  Total balance = <b><%= balance %></b>
</h3>

<div class="row recDisplay">
  <h2 class="col-lg-6 col-12 a">Paid by you</h2>
  <h2 class="col-lg-6 col-12 b">Paid by client</h2>
</div>

<div class="advocateRec" style="display: none;">
  <div class="row mAuto thead">
    <h3 class="col-lg-3 col-3">Date</h3>
    <h3 class="col-lg-6 col-5">Purpose</h3>
    <h3 class="col-lg-3 col-4">Amount</h3>
  </div>
  <% if(records.advocate.length === 0){ %>
  <h2 id="noRecordShow1">No records to show</h2>
  <% }else{ %>
  <h2 id="noRecordShow1" style="display: none;">No records to show</h2>
  <% } %> <% for(let i=0; i < records.advocate.length; ++i){ %>
  <div id="<%= records.advocate[i]._id %>" class="row mAuto tbody">
    <div class="col-lg-3 titem"><%= records.advocate[i].date %></div>
    <div class="col-lg-6 titem"><%= records.advocate[i].purpose %></div>
    <div class="col-lg-3 titem rec-amount">
      <b><%= records.advocate[i].amount %></b>
      <img
        src="/images/trash.png"
        alt="Delete"
        class="delete"
        onclick="alertDelete('<%= records.advocate[i]._id %>', 0)"
      />
    </div>
  </div>
  <% } %>
  <button class="phButton m-5 p-2 btn btn-lg btn-dark">New Record</button>
</div>

<div class="clientRec" style="display: none;">
  <div class="row mAuto thead">
    <h3 class="col-lg-3 col-3">Date</h3>
    <h3 class="col-lg-6 col-5">Purpose</h3>
    <h3 class="col-lg-3 col-4">Amount</h3>
  </div>
  <% if(records.client.length === 0){ %>
  <h2 id="noRecordShow2">No records to show</h2>
  <% }else { %>
  <h2 id="noRecordShow2" style="display: none;">No records to show</h2>
  <% } %> <% for(let i=0; i < records.client.length; ++i){ %>
  <div id="<%= records.client[i]._id %>" class="row mAuto tbody">
    <div class="col-3 titem"><%= records.client[i].date %></div>
    <div class="col-6 titem"><%= records.client[i].purpose %></div>
    <div class="col-3 titem rec-amount">
      <b><%= records.client[i].amount %></b>
      <img
        src="/images/trash.png"
        alt="Delete"
        class="delete"
        onclick="alertDelete('<%= records.client[i]._id %>', 1)"
      />
    </div>
  </div>
  <% } %>
  <button class="phButton m-5 p-2 btn btn-lg btn-dark">New Record</button>
</div>

<div class="c deleteAlert" style="top: 50vh;" data-recordId="" data-recordOf="">
  <div class="">
    <h3>Are you sure you want to delete??</h3>
    <button class="btn btn-md btn-outline-dark m-3 py-1 px-4">Yes</button>
    <button class="btn btn-md btn-outline-dark m-3 py-1 px-4">No</button>
  </div>
</div>

<div class="newRec" style="display: none;">
  <img title="Close" class="close" src="/images/close.png" alt="Close" />
  <h2 id="paid-by" name="paid_by"></h2>
  <input
    type="text"
    name="date"
    id="new-rec-date"
    class="box"
    onfocus="(this.type='date')"
    onblur="(this.type='text')"
    placeholder="DATE"
  />
  <textarea
    name="purpose"
    id="new-rec-purpose"
    class="box address"
    cols="40"
    rows="3"
    placeholder="Purpose"
  ></textarea>
  <input
    type="text"
    name="amount"
    id="new-rec-amount"
    class="box"
    autocomplete="off"
    placeholder="Amount"
  />
  <button type="submit" class="btn btn-sm signUpButton" onclick="newRec()">
    Add Record
  </button>
</div> */
//}