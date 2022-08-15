A Simple Configuration Distribute tool based on [Vercel Serverless Function](https://vercel.com/docs/concepts/functions/serverless-functionshttps://vercel.com/docs/concepts/functions/serverless-functions) and [Notion API](https://developers.notion.com/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flikaci%2Fconfig-dist-vercel-notion&env=NOTION_KEY,NOTION_DATABASE_ID&repository-name=config-dist)


## Usage
HTTP get `https://test-kappa-three-61.vercel.app/api/config?id=xxxxxxxx-xxxx-xxxxx-this-is-a-new-id`   
will create a new page in your notion db   
<img width="622" alt="image" src="https://user-images.githubusercontent.com/3407980/184569122-cb091f9f-dd43-4720-9209-6966fa47bc44.png">

After check the `Authed` checkbox and fill the `Config` property   
<img width="622" alt="image" src="https://user-images.githubusercontent.com/3407980/184569166-330a65d4-efeb-43e7-a0b3-5968a22869f5.png">

HTTP get `https://test-kappa-three-61.vercel.app/api/config?id=xxxxxxxx-xxxx-xxxxx-this-is-a-new-id` will return the config you filled.   
<img width="705" alt="image" src="https://user-images.githubusercontent.com/3407980/184569468-2023b6a3-0f2e-4d3f-a84d-bf96b606e324.png">

## Deploy
1. Duplicate this DB https://www.notion.so/ee6fc4b03eb04d8e98811d8943b42200 , find your own NOTION_DATABASE_ID (not ee6fc4b03eb04d8e98811d8943b42200 but your own)
2. Create a [Notion Integration](https://developers.notion.com/docs#step-1-create-an-integration), keep your integration token as NOTION_KEY
3. Share the [duplicated DB to your Notion Integration](https://developers.notion.com/docs#step-2-share-a-database-with-your-integration)
4. Click -> [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flikaci%2Fconfig-dist-vercel-notion&env=NOTION_KEY,NOTION_DATABASE_ID&repository-name=config-dist) to deploy, fill NOTION_KEY NOTION_DATABASE_ID
