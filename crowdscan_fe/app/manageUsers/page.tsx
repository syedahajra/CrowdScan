"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  Users, 
  UserPlus, 
  UserCog, 
  Trash2,
  Mail,
  Key 
} from "lucide-react";
import { toast } from "sonner"; // Updated import
import { AppSidebar } from "@/components/app-sidebar";
import { 
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "regular";
  lastActive: string;
};

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@crowdscan.com",
      role: "admin",
      lastActive: "2023-06-15",
    },
    {
      id: "2",
      name: "Officer Smith",
      email: "officer@crowdscan.com",
      role: "regular",
      lastActive: "2023-06-14",
    },
  ]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "regular",
    tempPassword: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill all fields");
      return;
    }

    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    setUsers([
      ...users,
      {
        id: (users.length + 1).toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as "admin" | "regular",
        lastActive: "Never",
      },
    ]);

    toast.success("User created successfully", {
      description: (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email: {newUser.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>Temporary Password: {tempPassword}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ask the user to change this password on first login
          </p>
        </div>
      ),
    });

    setIsDialogOpen(false);
    setNewUser({ name: "", email: "", role: "regular", tempPassword: "" });
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="dashboard">
                    Facial Recognition System
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Manage Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              User Management
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Create New User
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "regular" | "admin") =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular User</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full mt-4" onClick={handleAddUser}>
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className="flex items-center gap-1 w-20 justify-center"
                      >
                        {user.role === "admin" ? (
                          <UserCog className="h-3 w-3" />
                        ) : (
                          <Users className="h-3 w-3" />
                        )}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Total users: {users.length} (Admins: {users.filter(u => u.role === "admin").length})</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}