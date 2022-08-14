import fetch from 'node-fetch';

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_API_VERSION = '2022-02-22';

function isRequestValid(request) {
    return request.query.id?.length === 36;
}

async function queryDatabase(value) {
    return await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${NOTION_KEY}`,
            'Notion-Version': NOTION_API_VERSION,
        },
        body: JSON.stringify(value),
    }).then(response => response.json())
        .catch(err => console.error(err));
}

async function updatePage(pageId, ip, ua) {
    console.log("updatePage", pageId)
    await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: 'PATCH', headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${NOTION_KEY}`,
            'Notion-Version': NOTION_API_VERSION,
        }, body: JSON.stringify({
            properties: {
                'IP': {rich_text: [{text: {content: ip}}]},
                'UA': {rich_text: [{text: {content: ua}}]},
            },
        }),
    }).then(response => response.json()).then(response => console.log(response)).catch(err => console.error(err));
}

async function createPage(id, ip, ua) {
    console.log("createPage", id);
    await fetch('https://api.notion.com/v1/pages', {
        method: 'POST', headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${NOTION_KEY}`,
            'Notion-Version': NOTION_API_VERSION,
        }, body: JSON.stringify({
            parent: {type: 'database_id', database_id: NOTION_DATABASE_ID}, properties: {
                'ID': {rich_text: [{text: {content: id}}]},
                'IP': {rich_text: [{text: {content: ip}}]},
                'UA': {rich_text: [{text: {content: ua}}]},
            },
        },),
    }).then(response => response.json()).then(response => console.log(response)).catch(err => console.error(err));
}

export default async function handler(request, response) {
    console.log('----------');
    console.log(request.method);
    console.log(request.headers);
    console.log(request.query);
    console.log(request.body);

    if (!NOTION_KEY || !NOTION_DATABASE_ID) {
        response.status(500).send("NOTION_KEY or NOTION_DATABASE_ID not found!");
    }

    if (!isRequestValid(request)) {
        console.log('request invalid, return');
        response.status(404).send('nothing here :(');
        return;
    }

    let queryId = request.query.id;
    let pagesMatchId = (await queryDatabase({
        filter: {property: 'ID', rich_text: {equals: queryId}},
        sorts: [{timestamp: 'last_edited_time', direction: 'descending'}],
    }))?.results;
    console.log('pagesMatchId', pagesMatchId);

    let pagesAuthed = pagesMatchId?.filter(p => p.properties.Authed?.checkbox === true);

    if (pagesAuthed?.length > 0) {
        //found match and authed page
        let pageId = pagesAuthed[0].id;
        //update ip and ua
        await updatePage(pageId, request.headers['x-real-ip'], request.headers['user-agent']);
        response.status(200).send(pagesAuthed[0].properties.Config.rich_text.map(r => r.plain_text).join(''));
    } else {
        if (pagesMatchId?.length > 0) {
            //id matches but not authed, update it
            let pageId = pagesMatchId[0].id;
            await updatePage(pageId, request.headers['x-real-ip'], request.headers['user-agent']);
        } else {
            //no matches create a new page
            await createPage(queryId, request.headers['x-real-ip'], request.headers['user-agent']);
        }
        response.status(403).json({
            msg: `not authed conf for ${queryId}`,
        });
    }

}
