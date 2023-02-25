Gianluca Di Vita - 101415332 \
Nader Fathzadeh - 101441256 \
Umut Yorulmaz - 101410083 \
Sarim Sohail - 101416162



# BCDV1025 - Enterprise Blockchain Development 

# Hyperledger Fabric Project

# Solution Design Document & Project Overview



# TEAM

Gianluca Di Vita - 101415332
MAIN: Business Analyst
ASSIST: Full Stack Developer

Umut Yorulmaz - 101410083
MAIN: Architect
ASSIST: Business Analyst

Nader Fathzadeh - 101441256
MAIN: Blockchain Developer 
ASSIST: Architect

Sarim Sohail - 101416162
MAIN: Full Stack Developer
ASSIST: Blockchain Developer 



# REQUIREMENTS

Operating system: Hyperledger Fabric is compatible with various operating systems, including Linux, Windows, and macOS. However, Linux is the recommended operating system for running Hyperledger Fabric nodes.

Virtual Machine(Optional): You can create a new virtual machine instance in a software such as Microsoft Azure or VirtualBox, and then install the necessary software components such as Docker, Go, and the Hyperledger Fabric SDK within the virtual machine to avoid installing all necessary software on your local machine.

Docker: Hyperledger Fabric uses Docker containers to run the network nodes. Therefore, you will need to have Docker installed on all the nodes in your network.

Chaincode Programming Language: The chaincode (smart contracts) for the Hyperledger Fabric network are commonly written in the GO programming language, but can also be done with Java and NodeJS.

Hyperledger Fabric SDK: You will need to use the Hyperledger Fabric SDK to interact with the network and perform actions such as submitting transactions, querying the ledger, and managing identities.

Certificate Authority (CA): Hyperledger Fabric uses a CA to manage the digital certificates that are used to authenticate network participants. You will need to set up and configure a CA for your network.



# SECTION I: BUSINESS

Project Abstract

A supply chain solution that tracks the transferring of product from producer, to supplier, to retailer. The system also stores values for quantity and quality of goods as well as date and time of transferring stages.

A Supply Chain Solution

Supply chain management is a critical part of any business, and with the increasing complexity of supply chains, maintaining the integrity of products in the supply chain is becoming more important. Using the transparency of blockchain technology and the interoperability of API’s Hyperledger Fabric provides a framework that enables multiple organizations to collaborate and share data in a secure and tamper-proof manner, making it an ideal platform for trusted supply chain management.
In this report, we will discuss a supply chain project built on the Hyperledger Fabric framework. The project is designed to allow three organizations (producer, supplier, and retailer) to track and update product values such as the quantity of the product, time of shipping and receiving between organizations, and quality of goods sent and received, allowing for cohesive supply chain management. This report will explain each component of the project in detail and provide a comprehensive understanding of how the project functions.




# Project Components

Network Architecture - Overview
The network component of the supply chain project consists of multiple peer nodes and organizations, an orderer node, and a certificate authority. Each organization consists of 3 nodes with a total of 9 in the whole system. The peer nodes are responsible for storing and validating the data on the blockchain as well as maintaining the integrity of the system in case of malicious users. The orderer node is responsible for managing the order of transactions and ensuring that they are added to the blockchain in the correct order. The certificate authority is responsible for managing the identity and access of the participants on the network ensuring the system is usable only by the nodes involved.

Network Architecture - Peers 

To expand on the peers of the system, It is important to note that each organization must have at least 1 Anchor Peer.  Anchor Peers also allow for its respective organization to discover the peers of another organization on the same channel. 

Peers can have multiple roles as well:
1. Endorsing Peers
Endorsing Peers validates the transactions based on the Channel Endorsement policy and maintains the Ledger. Chaincode can only be Invoked and Queried by the Endorsing Peers
2. Member Peers 
 Member peers only maintain the channel ledger.  Member peers may or may not have access to the Chaincode.


3. Admin Peers

 Admin Peers acts as an organization’s representative when updating or modifying the organization's definition or proposing the changes to Channel Consensus. Admin Peer can be either Endorsing Peer or a Member Peer.

Network Architecture - Channels

The project also makes use of Hyperledger Fabrics channels. In the supply chain project, each organization (producer, supplier, and retailer) has its own private channel. This ensures that each organization can only access the data that it is authorized to access. For example, the retailer cannot access the shipping information for a product that has not been delivered yet. Furthermore, each organization has its own MSP, which is responsible for managing the identities of its members. The MSP ensures that only authorized participants can access the private channel and perform actions on the blockchain network.

Chaincode

The chaincode component of the supply chain project contains the business logic that governs the behavior of the supply chain application. The chaincode defines the rules for creating, updating, and deleting assets on the blockchain. In this project, the chaincode is designed to allow participants to update the quantity of the product, time of shipping and receiving, and quality of goods sent and received.

Client Application

The client application component of the supply chain project is a web application that allows the participants to interact with the blockchain network. The client application is responsible for providing a user interface that allows the participants to view and update the data on the blockchain. Using Hyperledger Fabrics API the client application interacts with the chaincode to perform the required actions on the blockchain.

# Project Workflow

Product Creation 
The producer has a product to ship and begins an instance on the blockchain network. The producer specifies the product's name, quantity, and quality, and adds it to the blockchain.

Product Shipping 
The producer updates the product's status to 'Shipped' and adds the shipping information, such as the shipping date and the shipping address, to the blockchain network.

Product Receiving 
The supplier receives the product and updates the status to 'Received' on the blockchain. The supplier also adds the receiving information, such as the receiving date and the receiving address, to the blockchain network, keeping consistent with the quality and quantity.

Product Delivery 
The supplier delivers the product to the retailer and updates the product's status to 'Delivered' on the blockchain. The supplier also adds the delivery information, such as the delivery date and the delivery address, to the blockchain network.

Product To Consumer 
The retailer receives the product and is able to sell to a consumer. The retailer also adds the sale information, such as the sale date and the sale price, to the blockchain network.


# Project Diagrams

*Note: For implementation purposes, we have simplified the system to allow for better demonstration of the workflow. 

Use Case Diagram

This workflow shows the system being used in an ideal application setting with full capabilties. Three organizations exist with three peer nodes in each, all with access to the blockchain tracking values associated with the supply chain tracking instance.
Product Instance Created
Producer Ships to Supplier
Supplier Receives, Ships to Retailer
Retailer Receives, Product Reaches Customer

![HLF-PROJECT](https://user-images.githubusercontent.com/10506708/221318651-4c17ebbf-a38d-4147-aeda-33fe3ff94eb8.png)

Project Implementation Diagram

This workflow shows the system being used as we have designed it for the demonstration of this project. For simplicity, we have reduced each organization to a single peer each as there will be no risk for malicious use. 
The workflow follows the same as the application diagram. 

![HLF-PROJECT-2](https://user-images.githubusercontent.com/10506708/221318669-2aefbb06-21ef-4fda-81d6-dcc40bb35a15.png)

# Roles and Policies

Roles

In the supply chain project built on Hyperledger Fabric, there are three main roles: producer, supplier, and retailer. Each role has specific permissions and access to perform certain actions on the blockchain network. For example, the producer has permission to create and ship a product, while the supplier has permission to receive and deliver the product. The retailer has permission to sell the product. These roles are defined in the chaincode, and the client application enforces the policies to ensure that the participants can only perform actions they are authorized to perform.

Policies

The policies for the supply chain project are also defined in the chaincode. The policies govern who can perform actions on the blockchain network, and what actions they can perform. For example, a policy may state that only the producer can create a new product, or that the supplier must receive the product before it can be delivered. These policies ensure that the supply chain process is followed correctly and that the integrity of the product is maintained.



# SECTION II: APPLICATION

The project uses 2 organizations to communicate on a channel called mychannel. 
The chaincode is where the functionality will be executed. It is called supply_chain_1.0.
The chaincode has 4 functions.

	initStorage - initialize storage on the Ledger
	loadProduct - Set the inventory information on the Ledge
	transferProduct - updates the Ledger with the quantity shipped between parties
	listStorage -  Reads storage information from the Ledger 
	
Function Diagram

![HLF-PROJECT-3](https://user-images.githubusercontent.com/10506708/221318685-e80d5edf-e4aa-4fa4-b818-50914b3e8dac.png)

The process begins with the initStorage function and follows down to loadProduct and then eventually transferProduct. The listStorage function is a view function which means it is outside the workflow, has full insight to the chain's information, and is always accessible.

# Full Stack Workflow

The projects full stack architecture occurs as follows:

1. The project begins with the setting up of the architecture for the project. This includes necessary configuration on the Hyperledger Fabric network such as the nodes and channels for the network. 
2. The chaincode follows the project's initiation and contains the business logic and rules for the system's end goals. 
3. The next step is establishing the Fabric API endpoints to the eventual front end application which will allow for the user to interact with the Hyperledger Fabric project. 
4. The next step is split in two: the wallet stores data such as user and admin information and the gateway provides endpoint access to the network. Both are necessary for establishing a two-way connection between the end user and the information inside the application
5. The final setup is the frontend application. This involves the process of integrating the frontend application with the Hyperledger Fabric network, using the wallet and gateway to interact with the network and provide a user interface that allows access to the system.

# Full Stack Workflow Diagram

![HLF-PROJECT-4](https://user-images.githubusercontent.com/10506708/221318700-894ce2af-3e39-47fb-9c45-6d1dc161b751.png)

