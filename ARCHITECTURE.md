# Architecture Documentation

## **Data Model Design:**
DynamoDB table schema, key design, GSI strategy

### TestItem Table:
| key | Property | type |
| :--- | :--- | :--- |
| Partition Key | id | UUIDv4 |
| | subject | string |
| | itemType | string |
| | difficulty | number in range 1-5 |
| | content | object |
| | content.question | string |
| | content.options? | array[string] |
| | content.correctAnswer | string |
| | content.explaination | string |
| | metadata | object |
| | metadata.author | string |
| | metadata.created | number (UNIX timestamp) |
| | metadata.lastModified | number (UNIX timestamp) |
| GSI | metadata.rootTestItem | string |
| | metadata.status | enum('draft', 'review', 'approved', 'archived') |
| | metadata.tags | array[string] |
| GSI Sort Key | metadata.version | number |
| | securityLevel | enum('standard', 'secure', 'highly-secure') |
-----

### Thoughts around table design:
Use id as primary partition key, add a property to the metadata for rootTestItem that will match the partion key for the publicly available test question. This means that when creating a testItem, we will be writing a duplicate item that would reference the initial item. Any future updates would then create a new object of the new version (in addition to updating the root object).

Create a GSI using the rootTestItem as the partition key, and version as the sort key, this would include the id for the versions for a particular TestItem, allowing for retrieval and display during the versions GET call.

For the root object itself, set value of rootTestItem to `""` empty string, and when doing a list query for all TestItems, filter out ay TestItem that does include a rootTestId to only display the root TestItems, and not the stale versions of TestItems.

---

## **Infrastructure Choices:** 
Why you chose specific services and configurations

- AWS API Gateway
  - Synchronously invoke the Lambda
- Lambda
  - Node 24_X - Latest stable and secure version of Node
  - Triggered by call to API Gateway
  - If cold start latency is a concern, could configure Provisioned Concurrency
- DynamoDB
  - onDemand Billing
    - If there is a better understanding of expected traffic flow, would switch to provisioned capacity
  - use IAM policy to restrict actions different Lambdas can take on the DB

---
## **Scalability:**
How your design scales, potential bottlenecks

- AWS manages most of the scaling issues
- If there are large volumes of updates to test items may run into locking issues
- Large number of versions for test items would require additional managment for pagination
- Should rarely accessed data remain in Dynamo, or be moved to cold storage?

---
## **Security:**
Authentication, authorization, encryption, IAM policies

- Would use TLS for encryption of data in motion
- DynamoDB encrypt data by default to protect data at rest
- Defined IAM policies for Lambda -> DynamoDB
- Zod normalizes and filters TestItem inputs
- Lacked time to investigate adding additional authentication/authorization to API endpoints

---
## **Trade-offs:**
What you prioritized and what you'd add with more time

- Local environment setup for dev and test
- Prioritized RESTful design and API logic 
- Framework for infrastructure and AWS cdk
- Architecure and database planning

Would Improves:
  - Authentication/Authorization/IAM
  - Second pass on infrastructure
  - Second pass on DynamoDB design
  - Implement DynamoDB logic
  - Testing - test unhappy paths, bad inputs ect.
  - Add more API endpoints and associated infrastructure
  - Improve local development expeience (ex. `server.ts` routing)
  - Revisit best practices of where to keep Zod schemas
