This is the README file for the write-store.js extension for Ext. 

Author: Avi Deitcher
Email: avi [at] jsorm [dot] com
License: Please see the included license file license.txt or visit http://jsorm.com/license

0) Files included in this distribution
README.txt - this file
write-store.js - the actual library
write-store-src.js - non-minified version of the library
write-store.html - a sample page using the store
sample-data.json - sample data to populate the store

1) Installation
Installation is straightforward. Simple include write-store.js in your <script>..</script> 
includes on your HTML page. Make sure that write-store.js comes *after* any and all ext-*.js 
files, such as ext-base.js and ext-all.js.

To run the example, install the ext/ package in a directory named ext/ that is at the root of 
the write-store.html path. The tree structure is as follows:
write-store.html
write-store.js
localXHR2.js (if desired for file:// access)
ext/
	ext-all.js
	ext-base.js
	resources/ (etc.)

2) Limitations
write-store uses POST to submit changes/writes to the data store. Obviously, if you are working
off the local file system rather than a true Web server, the writes will fail.

3) Overview
Write-store provides three additional features to the standard Ext.data.Store. First, it provides
the ability to write changes back to the data source. The standard Ext.data.Store is read-only
with respect to the data source. The data is retrieved via proxy (normally HttpProxy), 
processed by a reader (usually Array, Json or Xml), and then populates the Store. Once in the
Store, you can modify the data, and the Store will handle modifying that data, but it will not
send that data back to the source in any way. Additionally, it only has a limited set of 
transaction methods. It does not fully manage commit vs. rollback. Finally, Ext.data.Store cannot
use as its source another Ext.data.Store. Why would this be useful? Let us assume you have a set of
hierarchical data. In Json, it might look like (simplified):
{person: 
 [
   {firstName: John, lastName: Smith, address: [{number: 123, street: Main St},{number: 456, street: Elm St}]},
   {firstName: Jill, lastName: Stein, address: [{number: 789, street: Park St},{number: 012, street: Birch St}]}
 ]
}

If you wanted to manage *both* the personal information (firstName, lastName) *and* the addresses,
the JsonReader and HttpProxy built into Ext.data.Store would require two fetches of data to manage this. 
The first fetch would be for the data with the root of 'person'. This would populate 2 Records each
with 3 fields: firstName, lastName, address. If you got a Record and did get('address') you would get 
an array of objects. You *could* turn those into Records and then populate another Store, but that is
tedious and likely to create errors. Additionally, writing back from the second Store to the first
can also be messy. StoreProxy provides a much cleaner solution. The second store is simply given a 
particular record and field in the first to use as its source of data.

In order to do the above activities, we have added several Ext.ux classes:
- StoreProxy - to fetch data from and send data to another Store
- HttpWriteProxy - adds an update method to HttpProxy
- JsonWriterReader - adds writing ability to JsonReader
- XmlWriterReader - stub to add writing ability to XmlReader (not yet functional)
- WriteStore - adds full transactions and writing ability to Ext.data.Store
- ObjectReader - the ability to convert between plain old javascript objects (POJSO?) and Ext.data.Record

4) Usage
4a) Transactions
write-store adds a larger and more accurate transaction feature set to Ext.data.Store. The existing
transaction support is limited as follows: remove and add are instantly committed; changes are stored
at the record level; no ordering of events. write-store transactions record all events: create, delete
and update. write-store transactions record events chronologically: a rollback will roll back all events
in reverse order, thus fully restoring to the first state. 
Usage of transactions is very simple. All events (create, update, delete) are considered to be part of
a transaction. The transaction is recorded until an end of transaction event occurs. This can be one of 
two types of event: commit or reject. If store.commitChanges() is called, all events in the transaction
are complete, and the journal is purged. If store.rejectChanges() is called, all events in the transaction
are rolled back. The journal is reversed in reverse order, undoing the last event, then the previous, etc.
until such time as the journal has been fully reversed. 

4b) StoreProxy
write-store adds the ability to use one Record in another store as the source for its data. Using the 
example above, we assume that we have storeA, which contains person records. We also have storeB,
which should contain the addresses for a particular member. To do so with StoreProxy, we would
do the following:

var Person = Ext.data.Record.create([{name: 'firstName'},{name: 'lastName'},{name: 'address'}]);
var Address = Ext.data.Record.create([{name: 'number'},{name: 'street'}])
var storeA = new Ext.ux.WriteStore({
	proxy: new Ext.ux.HttpWriteProxy({url: someUrl}),
	reader: new Ext.ux.JsonWriterReader({
		root: 'person'
	},Person)
});
storeA.load();
// do some stuff with storeA

// configure storeB to get its information from storeA, using the field in a record of address
var storeB = new Ext.ux.WriteStore({
	proxy: new Ext.ux.StoreProxy({store: storeA, field: 'address'}),
	reader: new Ext.ux.ObjectReader({},Address)
});
storeB.load({params: {id: someId}});
// do some stuff with storeB
storeB.commitChanges();

4c) Write
write-store adds the ability to POST changed data back to a URL. In order to do so,
you must also tell the store what proxy to use to send updated. 

The following is a sample configuration:
var Person = Ext.data.Record.create([{name: 'firstName'},{name: 'lastName'},{name: 'address'}]);
var storeA = new Ext.ux.WriteStore({
	proxy: new Ext.data.HttpProxy({url: someUrl}),
	updateProxy: new Ext.ux.HttpWriteProxy({url: somePostUrl}),
	reader: new Ext.ux.JsonWriterReader({
		root: 'person'
	},Person)
});
storeA.load();
// do some stuff with storeA
storeB.commitChanges();

When you call commitChanges(), the Store does the following, depending on if an updateProxy is configured.
(i) If an updateProxy is configured:
	(a) Send out a 'beforewrite' event. If any beforewrite handler returns false, do not proceed.
	(b) Use reader's write() method to convert from Records to raw data (e.g. Json)
	(c) Use updateProxy's update() method to send the data back to the server
	(d) If successful in sending the write, send out a "write" event. If any write handler returns false,
		do not complete the commit. If unsuccessful in sending the write (e.g. 404 error), send out
		"writeexception" event.
	(e) Commit the changes in the store and purge the journal.
	(f) Send out a "commit" event.
(ii) If no updateProxy is configured:
	(a) Commit the changes in the store and purge the journal.
	(b) Send out a "commit" event.

Note that there are two methods for sending data: replace and update. The default mode is update.
In update mode, all the journal entries since the last commit, reject or load, i.e. the entire transaction,
is sent back to the server. The server is expected to receive these updates and apply them as it sees fit.
In replace mode, the entire dataset - including unchanged data - is sent back to the server. Update mode 
works when the server can apply changes; replace mode works when it cannot. An example might be SQL
vs. updating flat files.

NOTE: You *must* set config parameter replaceWrite to true when using a StoreProxy.

Success vs. Failure: When sending data back to the source in a commit, there are three possible outcomes.
(a) The send (e.g. POST) fails. This can be due to application problems server-side, network problems, or
    a host of other issues. In HTTP parlance, this is anything other than a 200 response. WriteStore will
	send out a "writeexception" event.
(b) The send (e.g. POST) succeeds, and the processing succeeds. WriteStore will send out a "write" event
(c) The send (e.g. POST) succeeds, but the processing fails. For example, the POST goes, yet the processing
    on the server works and decides that it does not accept the changes. This is a network-layer success but
    an application-layer failure. WriteStore will send out a "write" event.

WriteStore can inherently determine if the send succeeds or fails. It cannot determine
if the application processing was successful. As such, the handling application is given the opportunity
(and expected to) vet the server's response, to determine if the result was successful from the application
layer perspective. If an updateProxy is configured, i.e. server-side write is expected, WriteStore will
send out a "writeexception" if any network-layer error occurs and stop the commit, case (a). If the 
network-layer succeeds, WriteStore will send out a "write" event *prior* to committing locally. The
"write" event has the parameters of the response object from the server, giving handlers the opportunity
to inspect the contents and decide if the application-layer succeeded, and if the local commit should proceed.
If any "write" handler returns false, the local commit will *not* proceed. If no handlers are configured,
or no handler returns false, the commit will proceed, and, when done, a "commit" event will be sent out.

5) Server Requirements
For load, server requirements are unchanged from normal Ext.data.Store. They can even work with file:// URLs
using Doug Hendricks' excellent localXHR.js modification. It can be found by searching for localXHR on the
ext forums http://extjs.com/forum/
For update, the server must accept POST. Further, it must be able to understand the syntax sent by the reader.
The updated data in both replace and update modes is sent as the POST parameter 'data'. The structure within
the data is highly dependent on both which mode and which reader. Sample data is shown as follows. The below is
posted as the parameter 'data'.

{root: [journal1,journal2,...,journalN]}
where each journal entry is an object as follows:

{type: updateType,data:{recordData}}
Where recordData is the record to update in EXACTLY the same format as was sent by the server on load(),
but with updated data.
Where updateType is one of: u = change, c = add, d = remove
All types are available at Ext.ux.WriteStore.types

If replaceWrite is chosen, then data is exactly in the format sent by the server, but with updated data.

Note: all POST transmissions are URI-encoded. You may need to decode them server-side.

A successful update/write or failure is to be included in the content from the server, and will be passed as
is to the "write" event handler.



