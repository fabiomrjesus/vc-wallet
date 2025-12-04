import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import './App.css'
import { BrowserRouter, Link, Navigate, Route, Routes, matchPath, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { LuScrollText } from 'react-icons/lu'
import { FaCheckDouble, FaWallet } from 'react-icons/fa'
import { TbCertificate, TbMessage2Plus, TbMessageCancel, TbPencilCheck, TbSchema } from 'react-icons/tb'
import { FaHouse } from 'react-icons/fa6'
import { MdFactCheck } from 'react-icons/md'
import TenantsPage from './pages/admin/Tenants/TenantsPage'
import NewTenantPage from './pages/admin/Tenants/NewTenantPage'
import SchemasPage from './pages/admin/Schemas/SchemasPage'
import NewSchemaPage from './pages/admin/Schemas/NewSchemaPage'
import PredicatesPage from './pages/admin/Predicates/PredicatesPage'
import NewPredicatePage from './pages/admin/Predicates/NewPredicatePage'
import IssueClaimPage from './pages/issuer/IssueClaimPage'
import RevokeClaimPage from './pages/issuer/RevokeClaimPage'
import IssuerClaimsPage from './pages/issuer/ClaimsPage'
import GenerateProofPage from './pages/holder/GenerateProofPage'
import HolderClaimsPage from './pages/holder/ClaimsPage'
import VerifyProofPage from './pages/verifier/VerifyProofPage'
import VerifierClaimsPage from './pages/verifier/ClaimsPage'
import IssuersPage from './pages/admin/Issuers/IssuersPage'
import NewIssuerPage from './pages/admin/Issuers/NewIssuerPage'

function App() {

  return (
    <BrowserRouter>
      <Box w="100vw" h="100vh" bg="#ffffff">
        <HStack gap="0" w="100%" h="100%" bg="#f6f6f6">
          <SideMenu/>
          <AppRoutes/>
        </HStack>     
      </Box>
    </BrowserRouter>
  )
}

export function SideMenu()
{
  const { pathname } = useLocation()
  const isActive = (path:string) => Boolean(matchPath({ path, end: true }, pathname))

  return (
          <VStack h="100%" pr="1rem" bg="#0C2B4E" pl="1rem" py="1rem" align="start" color="#cccccc" fontSize="0.65rem">
            <HStack color="#ffffff" fontWeight={600} fontSize="1rem" mb="1rem">
              <FaWallet/>
              <Text>VC WALLET</Text>
            </HStack>
            <Text pl="0.5rem" color="#999999" pb="0.25rem">ADMIN</Text>
            <VStack fontSize="0.85rem" gap={1} color="#ffffff" w="100%" align="start" mb="1.25rem">
              <MenuLink path="/admin/tenants" icon={<FaHouse/>} label="Tenants" isCurrent={isActive('/admin/tenants')}/>
              <MenuLink path="/admin/schemas" icon={<TbSchema/>} label="Schemas" isCurrent={isActive('/admin/schemas')}/>
              <MenuLink path="/admin/issuers" icon={<TbCertificate/>} label="Issuers" isCurrent={isActive('/admin/issuers')}/>
              <MenuLink path="/admin/predicates" icon={<MdFactCheck/>} label="Predicates" isCurrent={isActive('/admin/predicates')}/>
            </VStack>
            <Text pl="0.5rem" pb="0.25rem" color="#999999">ISSUER</Text>
            <VStack w="100%" fontSize="0.85rem" gap={3} color="#ffffff" align="start" mb="1.25rem">
              <MenuLink path="/issuer/claims/issue" icon={<TbMessage2Plus/>} label="Issue Claim" isCurrent={isActive('/issuer/claims/issue')}/>
              <MenuLink path="/issuer/claims/revoke" icon={<TbMessageCancel/>} label="Revoke Claim" isCurrent={isActive('/issuer/claims/revoke')}/>
              <MenuLink path="/issuer/claims" icon={<LuScrollText/>} label="My Claims" isCurrent={isActive('/issuer/claims')}/>
            </VStack>
            <Text pl="0.5rem" pb="0.25rem" color="#999999">HOLDER</Text>
            <VStack w="100%" gap={1} align="start" fontSize="0.85rem" color="#ffffff" mb="1.25rem">
              <MenuLink path="/holder/proofs/generate" icon={<TbPencilCheck/>} label="Generate Proof" isCurrent={isActive('/holder/proofs/generate')}/>
              <MenuLink path="/holder/claims" icon={<LuScrollText/>} label="My Claims" isCurrent={isActive('/holder/claims')}/>
            </VStack>
            <Text pl="0.5rem" pb="0.25rem" color="#999999">VERIFIER</Text>
            <VStack w="100%" gap={1} color="#ffffff" align="start" fontSize="0.85rem" mb="1.25rem">
              <MenuLink path="/verifier/proofs/verify" icon={<FaCheckDouble/>} label="Verify Proof" isCurrent={isActive('/verifier/proofs/verify')}/>
              <MenuLink path="/verifier/claims" icon={<LuScrollText/>} label="My Claims" isCurrent={isActive('/verifier/claims')}/>
            </VStack>
          </VStack>
        )
}

export function MenuLink({path, icon, label, isCurrent}:{isCurrent?:boolean, path:string, icon:ReactElement, label:string})
{
  const Icon = icon;
  return <Link style={{width:"100%"}} to={path}>
            <HStack borderRadius="5px" px="5px" w="100%" h="2rem"  fontWeight={600} bg={isCurrent ? "#9CC6DB":"transparent"} color={isCurrent ? "#0C2B4E":"inherit"}>
              {Icon}
              <Text textWrap="nowrap">{label}</Text>
            </HStack>
          </Link>
}

export function AppRoutes()
{
  return <Routes>
          <Route path="/" element={<Navigate to="/admin/tenants" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/tenants" replace />} />
          <Route path="/admin/tenants" element={<TenantsPage/>} />
          <Route path="/admin/tenants/new" element={<NewTenantPage/>} />
          <Route path="/admin/schemas" element={<SchemasPage/>} />
          <Route path="/admin/schemas/new" element={<NewSchemaPage/>} />
          <Route path="/admin/issuers" element={<IssuersPage/>} />
          <Route path="/admin/issuers/new" element={<NewIssuerPage/>} />
          <Route path="/admin/predicates" element={<PredicatesPage/>} />
          <Route path="/admin/predicates/new" element={<NewPredicatePage/>} />
          <Route path="/issuer/claims/issue" element={<IssueClaimPage/>} />
          <Route path="/issuer/claims/revoke" element={<RevokeClaimPage/>} />
          <Route path="/issuer/claims" element={<IssuerClaimsPage/>} />
          <Route path="/holder/proofs/generate" element={<GenerateProofPage/>} />
          <Route path="/holder/claims" element={<HolderClaimsPage/>} />
          <Route path="/verifier/proofs/verify" element={<VerifyProofPage/>} />
          <Route path="/verifier/claims" element={<VerifierClaimsPage/>} />
          <Route path="*" element={<Navigate to="/admin/tenants" replace />} />
        </Routes>
}


export default App
