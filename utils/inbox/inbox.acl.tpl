@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix lit: <https://__DIRECTORY__little-sister/>.
@prefix c: <https://__DIRECTORY__profile/card#>.
@prefix n1: <http://xmlns.com/foaf/0.1/>.

<#owner>
    a    n0:Authorization;
    n0:accessTo
       <https://__DIRECTORY__little-sister/inbox.acl>, lit:inbox;
    n0:agent
       c:me;
    n0:mode
       n0:Control, n0:Read, n0:Write.
<#readall>
    a    n0:Authorization;
    n0:accessTo
       lit:inbox;
    n0:agentClass
       n1:Agent;
    n0:mode
       n0:Append.
