"use client";

import React, { useState } from "react";
import { useDeleteUser, useUsers } from "@/queries/actions/usersActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Mail, Shield, Calendar, Smartphone, Eye, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { NoData } from "@/components/ui/no-data";

type DeviceInfo = {
  device: string;
  os?: string;
  browser?: string;
};

type Session = {
  deviceInfo?: DeviceInfo;
  ip?: string;
  userAgent?: string;
  lastActive?: string;
};

type TUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  banReason?: string;
  createdAt: string;
  sessions?: Session[];
  image?: string;
};

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

  const { data: users, isLoading } = useUsers({ search: search.trim() });
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser.mutateAsync(selectedUser.id);
      toast.success("User deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const openDeleteDialog = (user: TUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "moderator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
        <p className='text-muted-foreground'>Manage user accounts, roles, and permissions</p>
      </div>

      {/* Search Card */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input placeholder='Search by name, email...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-9' />
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-sm'>
                {users?.length || 0} users
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </CardHeader>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <CardContent>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead className='w-[250px]'>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id} className='hover:bg-muted/50 transition-colors'>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-9 w-9 border'>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback className='bg-primary/10 text-primary'>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col'>
                            <span className='font-medium'>{user.name}</span>
                            <span className='text-sm text-muted-foreground flex items-center gap-1'>
                              <Mail className='h-3 w-3' />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary' className={`${getRoleColor(user.role)} font-medium`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.banned ? (
                          <Badge variant='destructive' className='gap-1'>
                            <AlertTriangle className='h-3 w-3' />
                            {user.banReason || "Banned"}
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 gap-1'
                          >
                            <CheckCircle className='h-3 w-3' />
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <Calendar className='h-4 w-4' />
                          {format(new Date(user.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.sessions?.[0] && (
                          <div className='flex items-center gap-2 text-sm'>
                            <Smartphone className='h-4 w-4 text-muted-foreground' />
                            <span className='truncate max-w-[120px]'>{user.sessions[0].deviceInfo?.device || "Unknown"}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size='sm' variant='outline' className='gap-1'>
                                <Eye className='h-4 w-4' />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-lg'>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>Complete information about {user.name}</DialogDescription>
                              </DialogHeader>
                              <ScrollArea className='max-h-[60vh]'>
                                <div className='space-y-6 p-1'>
                                  {/* User Info */}
                                  <div className='flex items-center gap-4'>
                                    <Avatar className='h-16 w-16 border-2'>
                                      <AvatarImage src={user.avatar} alt={user.name} />
                                      <AvatarFallback className='text-lg'>{getInitials(user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className='text-xl font-semibold'>{user.name}</h3>
                                      <p className='text-muted-foreground flex items-center gap-1'>
                                        <Mail className='h-4 w-4' />
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* Details */}
                                  <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-1'>
                                      <p className='text-sm text-muted-foreground'>Role</p>
                                      <div className='flex items-center gap-2'>
                                        <Shield className='h-4 w-4' />
                                        <span className='font-medium'>{user.role}</span>
                                      </div>
                                    </div>
                                    <div className='space-y-1'>
                                      <p className='text-sm text-muted-foreground'>Status</p>
                                      {user.banned ? (
                                        <Badge variant='destructive' className='gap-1'>
                                          <AlertTriangle className='h-3 w-3' />
                                          Banned
                                        </Badge>
                                      ) : (
                                        <Badge variant='outline' className='gap-1 bg-green-50 text-green-700'>
                                          <CheckCircle className='h-3 w-3' />
                                          Active
                                        </Badge>
                                      )}
                                    </div>
                                    <div className='space-y-1'>
                                      <p className='text-sm text-muted-foreground'>Member Since</p>
                                      <div className='flex items-center gap-2'>
                                        <Calendar className='h-4 w-4' />
                                        <span>{format(new Date(user.createdAt), "PPP")}</span>
                                      </div>
                                    </div>
                                    {user.banReason && (
                                      <div className='space-y-1 col-span-2'>
                                        <p className='text-sm text-muted-foreground'>Ban Reason</p>
                                        <p className='text-sm'>{user.banReason}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Sessions */}
                                  {user.sessions && user.sessions.length > 0 && (
                                    <>
                                      <Separator />
                                      <div className='space-y-3'>
                                        <h4 className='font-semibold'>Active Sessions</h4>
                                        {user.sessions.map((session: Session, idx: number) => (
                                          <Card key={idx} className='bg-muted/50'>
                                            <CardContent className='p-4'>
                                              <div className='grid grid-cols-2 gap-3 text-sm'>
                                                <div>
                                                  <p className='text-muted-foreground'>Device</p>
                                                  <p className='font-medium'>{session.deviceInfo?.device || "Unknown"}</p>
                                                </div>
                                                <div>
                                                  <p className='text-muted-foreground'>OS</p>
                                                  <p>{session.deviceInfo?.os || "Unknown"}</p>
                                                </div>
                                                <div>
                                                  <p className='text-muted-foreground'>Browser</p>
                                                  <p>{session.deviceInfo?.browser || "Unknown"}</p>
                                                </div>
                                                <div>
                                                  <p className='text-muted-foreground'>IP Address</p>
                                                  <code className='text-xs bg-muted px-2 py-1 rounded'>{session.ip || "N/A"}</code>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog open={deleteDialogOpen && selectedUser?.id === user.id} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <Button size='sm' variant='destructive' className='gap-1' onClick={() => openDeleteDialog(user)}>
                                <Trash2 className='h-4 w-4' />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user
                                  <span className='font-semibold'> {user.name}</span> and remove all associated data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white'
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {(!users || users.length === 0) && <NoData />}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
