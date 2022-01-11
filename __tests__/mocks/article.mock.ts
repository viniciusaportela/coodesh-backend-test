export const articleInputMock = {
  "id": 1,
	"featured": false,
	"title": "title",
	"url": "https://www.example.com",
	"imageUrl": "https://www.example.com",
	"newsSite": "string",
	"summary": "string",
	"publishedAt": "2022-01-09T19:13:10.000Z",
}

export const articleOutputMock = {
  "id": 1,
	"featured": false,
	"title": "title",
	"url": "https://www.example.com",
	"imageUrl": "https://www.example.com",
	"newsSite": "string",
	"summary": "string",
	"publishedAt": "2022-01-09T19:13:10.000Z",
  "launches": [],
  "events": []
}

export const articleUpdatedInputMock = {
	"featured": true,
	"title": "title2",
	"url": "https://www.example2.com",
	"imageUrl": "https://www.example2.com",
	"newsSite": "string2",
	"summary": "string2",
	"publishedAt": "2020-01-09T19:13:10.000Z",
}

export const articleUpdatedDatabaseMock = {
  "id": 1,
	"featured": true,
	"title": "title2",
	"url": "https://www.example2.com",
	"imageUrl": "https://www.example2.com",
	"newsSite": "string2",
	"summary": "string2",
	"publishedAt": new Date("2020-01-09T19:13:10.000Z"),
  "events": [],
  "launches": []
}

export const fullArticleInputMock = {
  "id": 1,
	"featured": false,
	"title": "title",
	"url": "https://www.example.com",
	"imageUrl": "https://www.example.com",
	"newsSite": "string",
	"summary": "string",
	"publishedAt": "2022-01-09T19:13:10.000Z",
	"launches": ["c660df6f-7e33-4c90-a0f5-b27c8cb4c974"],
	"events": [2]
}

export const fullArticleOutputMock = {
  "id": 1,
	"featured": false,
	"title": "title",
	"url": "https://www.example.com",
	"imageUrl": "https://www.example.com",
	"newsSite": "string",
	"summary": "string",
	"publishedAt": "2022-01-09T19:13:10.000Z",
	"launches": [{"id": "c660df6f-7e33-4c90-a0f5-b27c8cb4c974", "provider": "provider"}],
	"events": [{
    "id": 2,
    "provider": "provider"
  }]
}
