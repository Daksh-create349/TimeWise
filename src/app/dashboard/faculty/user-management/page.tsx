
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Users, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import AddUserForm from "@/components/dashboard/faculty/add-user-form"

const initialUsersData = [
  {
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "student",
    department: "Computer Science",
    status: "active",
  },
  {
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@university.edu",
    role: "faculty",
    department: "Mathematics",
    status: "active",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@university.edu",
    role: "admin",
    department: "Administration",
    status: "active",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@university.edu",
    role: "student",
    department: "Biology",
    status: "pending",
  },
  {
    name: "Prof. Robert Johnson",
    email: "robert.johnson@university.edu",
    role: "faculty",
    department: "Physics",
    status: "inactive",
  },
]

type User = typeof initialUsersData[0]

export default function UserManagementPage() {
  const [usersData, setUsersData] = React.useState(initialUsersData)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const filteredUsers = usersData.filter(user => {
    const searchLower = search.toLowerCase()
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "secondary"
      case "pending":
        return "outline"
      case "inactive":
        return "destructive"
      default:
        return "default"
    }
  }
  
  const handleAddUser = (newUser: Omit<User, "status">) => {
    setUsersData([...usersData, { ...newUser, status: "active" }])
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="font-headline text-2xl">
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage students, faculty, and administrative users.
                  </CardDescription>
                </div>
              </div>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">Users ({filteredUsers.length})</p>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.department}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            // @ts-ignore
                            variant={getStatusBadgeVariant(user.status)}
                            className={
                              user.status === 'active' ? 'bg-green-600/10 text-green-700 border-green-600/20' : 
                              user.status === 'pending' ? 'bg-amber-600/10 text-amber-700 border-amber-600/20' : ''
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
       <DialogContent className="sm:max-w-md">
        <AddUserForm onUserAdd={handleAddUser} />
      </DialogContent>
    </Dialog>
  )
}
